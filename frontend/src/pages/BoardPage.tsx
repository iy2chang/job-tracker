import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, updateApplication } from "../api/applications";
import ApplicationCard from "../components/ApplicationCard";
import BoardColumn from "../components/BoardColumn";
import type { Application, Status, ApplicationFilters } from "../types";

const COLUMNS: { status: Status; title: string }[] = [
  { status: "wishlist", title: "Wishlist" },
  { status: "applied", title: "Applied" },
  { status: "interviewing", title: "Interviewing" },
  { status: "offer", title: "Offer" },
  { status: "rejected", title: "Rejected" },
];

const BOARD_FILTERS: ApplicationFilters = {
  sort: "date_applied",
  order: "desc",
};
const BOARD_KEY = ["applications", BOARD_FILTERS];

type MoveVariables = { id: number; status: Status };

function groupByStatus(
  applications: Application[],
): Record<Status, Application[]> {
  const groups: Record<Status, Application[]> = {
    wishlist: [],
    applied: [],
    interviewing: [],
    offer: [],
    rejected: [],
  };

  for (const app of applications) {
    groups[app.status].push(app);
  }

  return groups;
}

export default function BoardPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const { data, isPending, error } = useQuery({
    queryKey: BOARD_KEY,
    queryFn: () => getApplications(BOARD_FILTERS),
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: MoveVariables) =>
      updateApplication(id, { status }),
    onSuccess: (_updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p className="error">{error.message}</p>;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const id = Number(active.id);
    const newStatus = over.id as Status;
    const application = data.find((app) => app.id === id);
    if (!application || application.status === newStatus) return;

    moveMutation.mutate({ id, status: newStatus });
  };

  const groups = groupByStatus(data);
  const activeApplication = data.find((app) => app.id === activeId);

  return (
    <>
      {moveMutation.error && (
        <p className="error">
          Couldn't move the card: {moveMutation.error.message}
        </p>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="board">
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.status}
              status={column.status}
              title={column.title}
              applications={groups[column.status]}
            />
          ))}
        </div>

        <DragOverlay className="drag-overlay">
          {activeApplication ? (
            <ApplicationCard application={activeApplication} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

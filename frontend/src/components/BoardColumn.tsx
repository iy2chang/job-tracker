import type { Application, Status } from "../types";
import { useDroppable } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard";

type BoardColumnProps = {
  status: Status;
  title: string;
  applications: Application[];
};

export default function BoardColumn({
  status,
  title,
  applications,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={`column column-${status}${isOver ? " column-over" : ""}`}
    >
      <h3 className="column-title">
        {title} <span className="count">{applications.length}</span>
      </h3>
      <div className="column-cards">
        {applications.map((app) => (
          <DraggableCard key={app.id} application={app} />
        ))}
        {applications.length === 0 && (
          <p className="column-empty">Nothing here</p>
        )}
      </div>
    </div>
  );
}

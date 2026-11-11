import { useDraggable } from "@dnd-kit/core";
import type { Application } from "../types";
import ApplicationCard from "./ApplicationCard";

type DraggableCardProps = {
  application: Application;
};

export default function DraggableCard({ application }: DraggableCardProps) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: application.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "draggable dragging" : "draggable"}
    >
      <ApplicationCard application={application} />
    </div>
  );
}

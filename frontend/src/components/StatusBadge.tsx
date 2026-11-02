import type { Status } from "../types";

type StatusBadgeProps = {
  status: Status;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

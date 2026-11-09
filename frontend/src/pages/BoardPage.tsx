import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applications";
import BoardColumn from "../components/BoardColumn";
import type { Application, Status } from "../types";

const COLUMNS: { status: Status; title: string }[] = [
  { status: "wishlist", title: "Wishlist" },
  { status: "applied", title: "Applied" },
  { status: "interviewing", title: "Interviewing" },
  { status: "offer", title: "Offer" },
  { status: "rejected", title: "Rejected" },
];

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
  const { data, isPending, error } = useQuery({
    queryKey: ["applications", { sort: "date_applied", order: "desc" }],
    queryFn: () => getApplications({ sort: "date_applied", order: "desc" }),
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p className="error">{error.message}</p>;

  const groups = groupByStatus(data);

  return (
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
  );
}

import type { Application, Status } from "../types";

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

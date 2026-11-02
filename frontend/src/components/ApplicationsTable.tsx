import type { Application } from "../types";
import StatusBadge from "./StatusBadge";

type ApplicationsTableProps = {
  applications: Application[];
};

export default function ApplicationsTable({
  applications,
}: ApplicationsTableProps) {
  if (applications.length === 0) {
    return <p>No applications found.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Status</th>
          <th>Date applied</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id}>
            <td>{app.company}</td>
            <td>{app.role}</td>
            <td>
              <StatusBadge status={app.status} />
            </td>
            <td>{app.date_applied ?? "-"}</td>
            <td>{app.location ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { Link } from "react-router";
import type { Application } from "../types";

type ApplicationCardProps = {
  application: Application;
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link to={`/applications/${application.id}`} className="card">
      <strong>{application.company}</strong>
      <span>{application.role}</span>
      {application.location && (
        <span className="card-meta">{application.location}</span>
      )}
    </Link>
  );
}

import type { Application, Status } from "../types";
import ApplicationCard from "./ApplicationCard";

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
  return (
    <div className={`column column-${status}`}>
      <h3 className="column-title">
        {title} <span className="count">{applications.length}</span>
      </h3>
      <div className="column-cards">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
        {applications.length === 0 && (
          <p className="column-empty">Nothing here</p>
        )}
      </div>
    </div>
  );
}

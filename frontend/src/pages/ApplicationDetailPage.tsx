import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getApplication } from "../api/applications";
import StatusBadge from "../components/StatusBadge";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const isValidId = Number.isInteger(applicationId) && applicationId > 0;

  const {
    data: application,
    isPending,
    error,
  } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: isValidId,
  });

  if (!isValidId) return <p>That isn't a valid application link.</p>;
  if (isPending) return <p>Loading</p>;
  if (error) return <p className="error">{error.message}</p>;

  return (
    <section>
      <Link to="/">← All applications</Link>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applications";

export default function ApplicationsPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => getApplications(),
  });

  if (isPending) return <p>Loading</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((app) => (
        <li key={app.id}>
          {app.id}
          {app.company} - {app.role}
        </li>
      ))}
    </ul>
  );
}

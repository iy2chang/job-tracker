import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import type { ApplicationFilters, Status } from "../types";

export default function ApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>({
    sort: "date_applied",
    order: "desc",
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["applications", filters],
    queryFn: () => getApplications(filters),
    placeholderData: keepPreviousData,
  });

  return (
    <section>
      <div className="filters">
        <input
          placeholder="Search company..."
          value={filters.company ?? ""}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              status:
                e.target.value === "" ? undefined : (e.target.value as Status),
            })
          }
        >
          <option value="">All statuses</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isPending && <p>Loading...</p>}
      {error && (
        <p className="error">Couldn't load applications: {error.message}</p>
      )}
      {data && <ApplicationsTable applications={data} />}
    </section>
  );
}

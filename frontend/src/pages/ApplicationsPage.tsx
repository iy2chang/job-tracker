import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getApplications } from "../api/applications";
import ApplicationsTable from "../components/ApplicationsTable";
import { STATUSES, type ApplicationFilters, type Status } from "../types";

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
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, company: e.target.value }))
          }
        />
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status:
                e.target.value === "" ? undefined : (e.target.value as Status),
            }))
          }
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sort: e.target.value as ApplicationFilters["sort"],
            }))
          }
        >
          <option value="date_applied">Sort by date applied</option>
          <option value="company">Sort by company</option>
          <option value="status">Sort by status</option>
          <option value="id">Sort by date added</option>
        </select>
        <select
          value={filters.order}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              order: e.target.value as ApplicationFilters["order"],
            }))
          }
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
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

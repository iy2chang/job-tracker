import { Link, useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApplication,
  deleteApplication,
  updateApplication,
} from "../api/applications";
import { useState } from "react";
import ApplicationForm from "../components/ApplicationForm";
import StatusBadge from "../components/StatusBadge";
import type { ApplicationUpdate } from "../types";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const isValidId = Number.isInteger(applicationId) && applicationId > 0;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: application,
    isPending,
    error,
  } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: isValidId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ApplicationUpdate) =>
      updateApplication(applicationId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["application", applicationId], updated);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(applicationId),
    onSuccess: () => {
      // need to remove the cache, otherwise when invalidate it, tanstack query might refetch again and get a 404
      queryClient.removeQueries({ queryKey: ["application", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      navigate("/");
    },
  });

  if (!isValidId) return <p>That isn't a valid application link.</p>;
  if (isPending) return <p>Loading</p>;
  if (error) return <p className="error">{error.message}</p>;

  const handleDelete = () => {
    if (window.confirm(`Delete ${application.company}?`)) {
      deleteMutation.mutate();
    }
  };

  if (isEditing) {
    return (
      <section>
        <h2>Edit application</h2>
        <ApplicationForm
          initialValues={application}
          submitLabel="Save changes"
          isSubmitting={updateMutation.isPending}
          error={updateMutation.error}
          onSubmit={(data) => updateMutation.mutate(data)}
          onCancel={() => setIsEditing(false)}
        />
      </section>
    );
  }

  return (
    <section>
      <Link to="/">← All applications</Link>
      <div className="actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={handleDelete} disabled={deleteMutation.isPending}>
          Delete
        </button>
      </div>
      <h2>{application.company}</h2>
      <p>{application.role}</p>
      <dl className="details">
        <dt>Status</dt>
        <dd>
          <StatusBadge status={application.status} />
        </dd>
        <dt>Location</dt>
        <dd>{application.location ?? "-"}</dd>
        <dt>Job posting</dt>
        <dd>
          {application.job_url ? (
            <a href={application.job_url} target="_blank" rel="noreferrer">
              {application.job_url}
            </a>
          ) : (
            "-"
          )}
        </dd>
        <dt>Notes</dt>
        <dd>{application.notes || "-"}</dd>
      </dl>
    </section>
  );
}

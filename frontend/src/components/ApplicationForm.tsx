import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { ApplicationCreate, Status, Application } from "../types";

type FormValues = {
  company: string;
  role: string;
  status: Status;
  date_applied: string;
  location: string;
  job_url: string;
  notes: string;
};

type ApplicationFormProps = {
  initialValues?: Application;
  submitLabel: string;
  isSubmitting: boolean;
  error: Error | null;
  onSubmit: (data: ApplicationCreate) => void;
  onCancel: () => void;
};

function toFormValues(app?: Application): FormValues {
  return {
    company: app?.company ?? "",
    role: app?.role ?? "",
    status: app?.status ?? "wishlist",
    date_applied: app?.date_applied ?? "",
    location: app?.location ?? "",
    job_url: app?.job_url ?? "",
    notes: app?.notes ?? "",
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export default function ApplicationForm({
  initialValues,
  submitLabel,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(initialValues),
  );

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      company: values.company.trim(),
      role: values.role.trim(),
      status: values.status,
      date_applied: emptyToNull(values.date_applied),
      location: emptyToNull(values.location),
      job_url: emptyToNull(values.job_url),
      notes: emptyToNull(values.notes),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Company *
        <input
          name="company"
          value={values.company}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Role *
        <input
          name="role"
          value={values.role}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Status
        <select name="status" value={values.status} onChange={handleChange}>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>
      <label>
        Date Applied
        <input
          name="date_applied"
          value={values.date_applied}
          onChange={handleChange}
        />
      </label>
      <label>
        Location
        <input
          name="location"
          value={values.location}
          onChange={handleChange}
        />
      </label>
      <label>
        Job Url
        <input name="job_url" value={values.job_url} onChange={handleChange} />
      </label>
      <label>
        Notes
        <input name="notes" value={values.notes} onChange={handleChange} />
      </label>

      {error && <p className="error">{error.message}</p>}

      <div className="actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

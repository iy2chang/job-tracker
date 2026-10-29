export type Status =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export type Application = {
  id: number;
  company: string;
  role: string;
  job_url: string | null;
  status: Status;
  date_applied: string | null;
  location: string | null;
  notes: string | null;
};

export type ApplicationCreate = Omit<Application, "id">;

export type ApplicationUpdate = Partial<ApplicationCreate>;

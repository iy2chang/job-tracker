import type { Application, ApplicationFilters } from "../types";

const API_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ErrorBody = {
  detail?: string | { loc: (string | number)[]; msg: string }[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body: ErrorBody = await response.json();
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail
          .map((e) => `${e.loc.at(-1)}: ${e.msg}`)
          .join(", ");
      }
    } catch {
      // the body wasn't JSON, so keep the generic message
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getApplications(
  filters: ApplicationFilters = {},
): Promise<Application[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.company) params.set("company", filters.company);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);

  const query = params.toString();
  return request<Application[]>(`/applications${query ? `?${query}` : ""}`);
}

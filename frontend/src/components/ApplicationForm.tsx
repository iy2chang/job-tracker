import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { ApplicationCreate, Status, Application } from "../types";

type FormValue = {
  company: string;
  role: string;
  status: Status;
  date_applied: string;
  location: string;
  job_url: string;
  notes: string;
};

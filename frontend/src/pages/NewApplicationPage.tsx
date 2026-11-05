import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApplication } from "../api/applications";
import ApplicationForm from "../components/ApplicationForm";

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      navigate(`/applications/${created.id}`);
    },
  });

  return (
    <section>
      <h2>New application</h2>
      <ApplicationForm
        submitLabel="Add application"
        isSubmitting={createMutation.isPending}
        error={createMutation.error}
        onSubmit={(data) => createMutation.mutate(data)}
        onCancel={() => navigate("/")}
      />
    </section>
  );
}

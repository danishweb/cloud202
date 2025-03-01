"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { FormContainer } from "@/components/ui/form-container";
import { useFormContext } from "@/lib/form-context";

export default function WorkflowsConfigPage() {
  const router = useRouter();
  const { updateWorkflows } = useFormContext();

  const handleNext = () => {
    updateWorkflows({
      selectedWorkflows: ["default-workflow"],
    });
    router.push("/config/security");
  };

  const handlePrev = () => {
    router.push("/config/rag");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Workflows Configuration" />

      <FormContainer
        prevHref="/config/rag"
        nextHref="/config/security"
        onNext={handleNext}
        onPrev={handlePrev}
      >
        <div className="flex items-center justify-center h-64 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">
            Default workflow will be selected automatically
          </p>
        </div>
      </FormContainer>
    </div>
  );
}

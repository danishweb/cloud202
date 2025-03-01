"use client";

import { useFormContext } from "@/lib/form-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

type RouteProtectionProps = {
  children: ReactNode;
};

export function RouteProtection({ children }: RouteProtectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isBasicStepValid,
    isRagStepValid,
    isWorkflowsStepValid,
    isSecurityStepValid,
  } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    const canAccessRag = isBasicStepValid();
    const canAccessWorkflows = canAccessRag && isRagStepValid();
    const canAccessSecurity = canAccessWorkflows && isWorkflowsStepValid();
    const canAccessOverview = canAccessSecurity && isSecurityStepValid();

    let shouldRedirect = false;
    let redirectTo = "/config/basic";
    let message = "";

    if (pathname === "/config/rag" && !canAccessRag) {
      shouldRedirect = true;
      message = "Please complete the Basic Configuration step first.";
    } else if (pathname === "/config/workflows" && !canAccessWorkflows) {
      shouldRedirect = true;
      redirectTo = "/config/rag";
      message = "Please complete the RAG Configuration step first.";
    } else if (pathname === "/config/security" && !canAccessSecurity) {
      shouldRedirect = true;
      redirectTo = "/config/workflows";
      message = "Please complete the Workflows step first.";
    } else if (pathname === "/config/overview" && !canAccessOverview) {
      shouldRedirect = true;
      redirectTo = "/config/security";
      message = "Please complete the Security step first.";
    }

    if (shouldRedirect) {
      setRedirectMessage(message);
      setTimeout(() => {
        router.replace(redirectTo);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [
    pathname,
    router,
    isBasicStepValid,
    isRagStepValid,
    isWorkflowsStepValid,
    isSecurityStepValid,
  ]);

  if (isLoading && pathname !== "/config/basic") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          {redirectMessage ? (
            <>
              <p className="text-sm text-muted-foreground mt-2">
                {redirectMessage}
              </p>
              <p className="text-xs text-muted-foreground/70">Redirecting...</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Checking form completion status...
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

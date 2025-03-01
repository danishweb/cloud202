"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { FormContainer } from "@/components/ui/form-container";
import { Button } from "@/components/ui/button";
import {
  Check,
  Database,
  GitBranch,
  Settings,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useFormContext } from "@/lib/form-context";
import { useState, useEffect } from "react";

export default function OverviewPage() {
  const router = useRouter();
  const { formState, resetForm } = useFormContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const handlePrev = () => {
    router.push("/config/security");
  };

  // Handle countdown and redirect after successful submission
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isSubmitted && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSubmitted && redirectCountdown === 0) {
      // Reset form and redirect
      resetForm();
      router.push("/config/basic");
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSubmitted, redirectCountdown, resetForm, router]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Submit the form data to the API
      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save configuration');
      }
      
      // Show success message and start countdown
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Configuration Overview" />

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 md:p-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-medium text-green-800">Configuration Saved!</h2>
          <p className="text-green-600 text-center">
            Your configuration has been saved successfully to the database.
          </p>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Redirecting to the start in {redirectCountdown} seconds...
            </p>
            <Button 
              className="mt-4"
              onClick={() => {
                resetForm();
                router.push("/config/basic");
              }}
            >
              Start New Configuration Now
            </Button>
          </div>
        </div>
      ) : (
        <FormContainer 
          prevHref="/config/security" 
          customNextButton={
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  <span className="mr-2">Save Configuration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          }
          onPrev={handlePrev}
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              <p className="font-medium">Error saving configuration:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="bg-muted/10 p-4 rounded-md border">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Basic Configuration</h3>
              </div>
              <div className="ml-7 space-y-1 text-sm">
                <p><span className="font-medium">App Name:</span> {formState.basic.appName}</p>
                <p><span className="font-medium">Description:</span> {formState.basic.description}</p>
              </div>
            </div>
            
            <div className="bg-muted/10 p-4 rounded-md border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="font-medium">RAG Configuration</h3>
              </div>
              <div className="ml-7 space-y-1 text-sm">
                <p><span className="font-medium">Knowledge Base:</span> {formState.rag.knowledgeBaseName}</p>
                <p><span className="font-medium">Description:</span> {formState.rag.description}</p>
                {formState.rag.pattern && <p><span className="font-medium">Pattern:</span> {formState.rag.pattern}</p>}
                {formState.rag.embeddings && <p><span className="font-medium">Embeddings:</span> {formState.rag.embeddings}</p>}
                {formState.rag.metrics && <p><span className="font-medium">Metrics:</span> {formState.rag.metrics}</p>}
                {formState.rag.chunking && <p><span className="font-medium">Chunking:</span> {formState.rag.chunking}</p>}
                <p><span className="font-medium">Vector DB:</span> {formState.rag.vectorDb}</p>
              </div>
            </div>
            
            <div className="bg-muted/10 p-4 rounded-md border">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Workflows</h3>
              </div>
              <div className="ml-7 space-y-1 text-sm">
                <p><span className="font-medium">Selected Workflows:</span> {formState.workflows.selectedWorkflows.join(", ") || "None"}</p>
              </div>
            </div>
            
            <div className="bg-muted/10 p-4 rounded-md border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Security</h3>
              </div>
              <div className="ml-7 space-y-1 text-sm">
                <p><span className="font-medium">Encryption:</span> {formState.security.enableEncryption ? "Enabled" : "Disabled"}</p>
                <p><span className="font-medium">Audit:</span> {formState.security.enableAudit ? "Enabled" : "Disabled"}</p>
                <p><span className="font-medium">RBAC:</span> {formState.security.enableRBAC ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
}

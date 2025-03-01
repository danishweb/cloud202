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
        <div className="bg-green-50 border border-green-200 rounded-md p-6 flex flex-col items-center justify-center space-y-4">
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
              <ArrowRight className="mr-2 h-4 w-4" />
              Start New Configuration
            </Button>
          </div>
        </div>
      ) : (
        <FormContainer
          prevHref="/config/security"
          onPrev={handlePrev}
          customNextButton={
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          }
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p className="font-medium">Error saving configuration:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Configuration Summary</h2>
              <div className="text-sm text-muted-foreground">
                Review your configuration before saving
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Basic Configuration</h3>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/config/basic")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="pl-7 space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">App Name:</span>
                    <span>{formState.basic.appName || "Not set"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Description:</span>
                    <span>{formState.basic.description || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">RAG Configuration</h3>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/config/rag")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="pl-7 space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Knowledge Base:</span>
                    <span>{formState.rag.knowledgeBaseName || "Not set"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Pattern:</span>
                    <span>{formState.rag.pattern || "Not set"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Embeddings:</span>
                    <span>{formState.rag.embeddings || "Not set"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Vector DB:</span>
                    <span>{formState.rag.vectorDb || "Not set"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Configurations:</span>
                    <div>
                      {formState.rag.configurations && formState.rag.configurations.length > 0 ? (
                        <div className="space-y-1">
                          {formState.rag.configurations.map((config, index) => (
                            <div key={index} className="flex flex-wrap gap-1">
                              {Object.entries(config).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                                  <span className="font-medium">{key}:</span> {value}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>No additional configurations</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Workflows</h3>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/config/workflows")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="pl-7 space-y-2">
                  <div className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50">
                      No workflows required
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Security</h3>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/config/security")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="pl-7 space-y-2">
                  <div className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50">
                      No security configuration required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
}

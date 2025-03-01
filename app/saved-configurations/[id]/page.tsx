"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database, GitBranch, Settings, ShieldCheck } from "lucide-react";
import { IConfiguration } from "@/models/Configuration";

export default function ConfigurationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [configuration, setConfiguration] = useState<IConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/configurations/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch configuration");
        }

        setConfiguration(result.data);
      } catch (err) {
        console.error("Error fetching configuration:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfiguration();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !configuration) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error || "Configuration not found"}</p>
        </div>
        <Button onClick={() => router.push("/saved-configurations")}>
          Back to Configurations
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.push("/saved-configurations")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <PageHeader title={`Configuration: ${configuration.basic.appName}`} />
      </div>

      <div className="bg-card rounded-md border shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Configuration Details</h2>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(configuration.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Basic Configuration</h3>
              </div>
              <div className="pl-7 space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">App Name:</span>
                  <span>{configuration.basic.appName || "Not set"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <span>{configuration.basic.description || "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-medium">RAG Configuration</h3>
              </div>
              <div className="pl-7 space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Knowledge Base:</span>
                  <span>{configuration.rag.knowledgeBaseName || "Not set"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Pattern:</span>
                  <span>{configuration.rag.pattern || "Not set"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Embeddings:</span>
                  <span>{configuration.rag.embeddings || "Not set"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Vector DB:</span>
                  <span>{configuration.rag.vectorDb || "Not set"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Configurations:</span>
                  <div>
                    {configuration.rag.configurations && configuration.rag.configurations.length > 0 ? (
                      <div className="space-y-1">
                        {configuration.rag.configurations.map((config, index) => (
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
              </div>
              <div className="pl-7 space-y-2">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50">
                    {configuration.workflows.selectedWorkflows.length > 0 
                      ? `${configuration.workflows.selectedWorkflows.length} workflow(s) configured` 
                      : "No workflows required"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Security</h3>
              </div>
              <div className="pl-7 space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Encryption:</span>
                  <span>{configuration.security.enableEncryption ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Audit:</span>
                  <span>{configuration.security.enableAudit ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">RBAC:</span>
                  <span>{configuration.security.enableRBAC ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

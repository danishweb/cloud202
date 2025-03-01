"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer } from "@/components/ui/form-container";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/lib/form-context";
import {
  ragFormSchema,
  ragSubmissionSchema,
  type RagFormValues,
} from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface RagConfig {
  kbName: string;
  description: string;
  pattern: string;
  chunking: string;
  embeddings: string;
  metrics: string;
  vectorDb: string;
}

export default function RagConfigPage() {
  const router = useRouter();
  const { formState, updateRag } = useFormContext();
  const [ragConfigs, setRagConfigs] = useState<RagConfig[]>([]);

  const columns: ColumnDef<RagConfig>[] = [
    {
      accessorKey: "kbName",
      header: "KB Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "pattern",
      header: "Pattern",
    },
    {
      accessorKey: "chunking",
      header: "Chunking",
    },
    {
      accessorKey: "embeddings",
      header: "Embeddings",
    },
    {
      accessorKey: "metrics",
      header: "Metrics",
    },
    {
      accessorKey: "vectorDb",
      header: "Vector DB",
    },
  ];

  const form = useForm<RagFormValues>({
    resolver: zodResolver(ragFormSchema),
    defaultValues: {
      knowledgeBaseName: "",
      description: "",
      pattern: "",
      embeddings: "",
      metrics: "",
      chunking: "",
      vectorDb: "",
      configurations: [],
    },
  });

  useEffect(() => {
    if (formState.rag) {
      form.reset(formState.rag);

      if (
        formState.rag.configurations &&
        formState.rag.configurations.length > 0
      ) {
        const existingConfigs = formState.rag.configurations.map((config) => {
          const typedConfig = config as Record<string, string>;
          return {
            kbName: typedConfig.kbName || "",
            description: typedConfig.description || "",
            pattern: typedConfig.pattern || "",
            chunking: typedConfig.chunking || "",
            embeddings: typedConfig.embeddings || "",
            metrics: typedConfig.metrics || "",
            vectorDb: typedConfig.vectorDb || "",
          };
        });

        setRagConfigs(existingConfigs);
      }
    }
  }, [form, formState.rag]);

  function onSubmit(data: RagFormValues) {
    try {
      const result = ragSubmissionSchema.parse(data);
      const updatedData = {
        ...result,
        configurations: formState.rag.configurations || [],
      };

      updateRag(updatedData);

      router.push("/config/workflows");
    } catch (error) {
      console.error("Validation error:", error);

      if (error instanceof Error) {
        alert("Please fill out all required fields before proceeding.");
      }
    }
  }

  const handleNext = () => {
    form.handleSubmit(onSubmit)();
  };

  const handlePrev = () => { 
    const currentValues = form.getValues();
    updateRag({
      ...currentValues,
      configurations: formState.rag.configurations || [],
    });
 
    router.push("/config/basic");
  };

  const handleAddConfiguration = async () => { 
    const isValid = await form.trigger();
    if (!isValid) {
      return;  
    }

    const formValues = form.getValues();

    
    const newConfig: RagConfig = {
      kbName: formValues.knowledgeBaseName,
      description: formValues.description,
      pattern: formValues.pattern || "",
      chunking: formValues.chunking || "",
      embeddings: formValues.embeddings || "",
      metrics: formValues.metrics || "",
      vectorDb: formValues.vectorDb,
    };
 
    const updatedConfigs = [...ragConfigs, newConfig];
    setRagConfigs(updatedConfigs);
 
    const configRecord: Record<string, string> = {
      kbName: newConfig.kbName,
      description: newConfig.description,
      pattern: newConfig.pattern,
      chunking: newConfig.chunking,
      embeddings: newConfig.embeddings,
      metrics: newConfig.metrics,
      vectorDb: newConfig.vectorDb,
    };
 
    updateRag({
      ...formValues,
      configurations: [...(formState.rag.configurations || []), configRecord],
    });
 
    form.reset({
      knowledgeBaseName: "",
      description: "",
      pattern: "",
      embeddings: "",
      metrics: "",
      chunking: "",
      vectorDb: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="RAG configuration" />

      <FormContainer
        prevHref="/config/basic"
        nextHref="/config/workflows"
        onNext={handleNext}
        onPrev={handlePrev}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="knowledgeBaseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KB Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter KB Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Contextual RAG">
                            Contextual RAG
                          </SelectItem>
                          <SelectItem value="Agentic RAG">
                            Agentic RAG
                          </SelectItem>
                          <SelectItem value="Hybrid RAG">Hybrid RAG</SelectItem>
                          <SelectItem value="Graph RAG">Graph RAG</SelectItem>
                          <SelectItem value="Self-reflective RAG">
                            Self-reflective RAG
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="embeddings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embeddings</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select embeddings" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="256">256</SelectItem>
                          <SelectItem value="512">512</SelectItem>
                          <SelectItem value="1024">1024</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metrics</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metrics" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cosine">Cosine</SelectItem>
                          <SelectItem value="Dot">Dot</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Euclidean norm">
                            Euclidean norm
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chunking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chunking</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select chunking" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Semantic">Semantic</SelectItem>
                          <SelectItem value="Fixed sized">
                            Fixed sized
                          </SelectItem>
                          <SelectItem value="Recursive">Recursive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vectorDb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vector DB</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vector DB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddConfiguration}
                  className="flex items-center gap-1"
                  disabled={
                    !form.formState.isValid ||
                    !form.getValues().knowledgeBaseName ||
                    !form.getValues().description ||
                    !form.getValues().vectorDb
                  }
                >
                  <Plus className="w-4 h-4" />
                  Add Configuration
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset({
                      knowledgeBaseName: "",
                      description: "",
                      pattern: "",
                      embeddings: "",
                      metrics: "",
                      chunking: "",
                      vectorDb: "",
                    });
                  }}
                  className="flex items-center gap-1"
                >
                  Reset Form
                </Button>
              </div>

              {ragConfigs.length > 0 && (
                <div className="mt-4">
                  <DataTable columns={columns} data={ragConfigs} />
                </div>
              )}
            </div>
          </form>
        </Form>
      </FormContainer>
    </div>
  );
}

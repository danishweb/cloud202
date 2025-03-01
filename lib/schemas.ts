import { z } from "zod";

// Basic configuration step schema
export const basicFormSchema = z.object({
  appName: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

// RAG configuration step schema
export const ragFormSchema = z.object({
  knowledgeBaseName: z.string().min(1, {
    message: "Knowledge base name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  pattern: z
    .enum(
      [
        "Contextual RAG",
        "Agentic RAG",
        "Hybrid RAG",
        "Graph RAG",
        "Self-reflective RAG",
      ],
      {
        message: "Please select a valid pattern.",
      }
    )
    .optional()
    .or(z.literal("")),
  embeddings: z
    .enum(["256", "512", "1024"], {
      message: "Please select a valid embedding size.",
    })
    .optional()
    .or(z.literal("")),
  metrics: z
    .enum(["Cosine", "Dot", "Product", "Euclidean norm"], {
      message: "Please select a valid metric.",
    })
    .optional()
    .or(z.literal("")),
  chunking: z
    .enum(["Semantic", "Fixed sized", "Recursive"], {
      message: "Please select a valid chunking method.",
    })
    .optional()
    .or(z.literal("")),
  vectorDb: z.string().min(1, {
    message: "Vector DB is required.",
  }),
  configurations: z.array(z.record(z.string())).optional().default([]),
});

export const ragSubmissionSchema = z.object({
  knowledgeBaseName: z.string().min(1, {
    message: "Knowledge base name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  pattern: z.enum(
    [
      "Contextual RAG",
      "Agentic RAG",
      "Hybrid RAG",
      "Graph RAG",
      "Self-reflective RAG",
    ],
    {
      message: "Please select a valid pattern.",
    }
  ),
  embeddings: z.enum(["256", "512", "1024"], {
    message: "Please select a valid embedding size.",
  }),
  metrics: z.enum(["Cosine", "Dot", "Product", "Euclidean norm"], {
    message: "Please select a valid metric.",
  }),
  chunking: z.enum(["Semantic", "Fixed sized", "Recursive"], {
    message: "Please select a valid chunking method.",
  }),
  vectorDb: z.string().min(1, {
    message: "Vector DB is required.",
  }),
  configurations: z.array(z.record(z.string())).optional().default([]),
});

// Workflow configuration step schema
export const workflowsFormSchema = z.object({
  selectedWorkflows: z
    .array(z.string())
    .min(1, { message: "At least one workflow is required" }),
});

// Security configuration step schema
export const securityFormSchema = z
  .object({
    enableEncryption: z.boolean(),
    enableAudit: z.boolean(),
    enableRBAC: z.boolean(),
  })
  .refine(
    (data) => data.enableEncryption || data.enableAudit || data.enableRBAC,
    {
      message: "At least one security option must be enabled",
      path: ["security"],
    }
  );

// Combined schema for the entire form
export const formSchema = z.object({
  basic: basicFormSchema,
  rag: ragFormSchema,
  workflows: workflowsFormSchema,
  security: securityFormSchema,
});

// Types derived from schemas
export type BasicFormValues = z.infer<typeof basicFormSchema>;
export type RagFormValues = z.infer<typeof ragFormSchema>;
export type WorkflowsFormValues = z.infer<typeof workflowsFormSchema>;
export type SecurityFormValues = z.infer<typeof securityFormSchema>;
export type FormValues = z.infer<typeof formSchema>;

// API validation schemas
export const createConfigurationSchema = formSchema;

export const updateConfigurationSchema = formSchema.partial();

export const configurationResponseSchema = formSchema.extend({
  _id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const configurationsListResponseSchema = z.array(
  configurationResponseSchema
);

export type ConfigurationResponse = z.infer<typeof configurationResponseSchema>;
export type ConfigurationsListResponse = z.infer<
  typeof configurationsListResponseSchema
>;

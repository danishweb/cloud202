import mongoose, { Schema, Document } from "mongoose";

export interface IBasicConfig {
  appName: string;
  description: string;
}

export interface IRagConfig {
  knowledgeBaseName: string;
  description: string;
  pattern: string;
  embeddings: string;
  metrics: string;
  chunking: string;
  vectorDb: string;
  configurations: Record<string, string>[];
}

export interface IWorkflowsConfig {
  selectedWorkflows: string[];
}

export interface ISecurityConfig {
  enableEncryption: boolean;
  enableAudit: boolean;
  enableRBAC: boolean;
}

export interface IConfiguration extends Document {
  basic: IBasicConfig;
  rag: IRagConfig;
  workflows: IWorkflowsConfig;
  security: ISecurityConfig;
  createdAt: Date;
  updatedAt: Date;
}

// Define schemas
const BasicConfigSchema = new Schema<IBasicConfig>({
  appName: { type: String, required: true },
  description: { type: String, required: true },
});

const RagConfigSchema = new Schema<IRagConfig>({
  knowledgeBaseName: { type: String, required: true },
  description: { type: String, required: true },
  pattern: { type: String, required: true },
  embeddings: { type: String, required: true },
  metrics: { type: String, required: true },
  chunking: { type: String, required: true },
  vectorDb: { type: String, required: true },
  configurations: [{ type: Map, of: String }],
});

const WorkflowsConfigSchema = new Schema<IWorkflowsConfig>({
  selectedWorkflows: [{ type: String }],
});

const SecurityConfigSchema = new Schema<ISecurityConfig>({
  enableEncryption: { type: Boolean, default: false },
  enableAudit: { type: Boolean, default: false },
  enableRBAC: { type: Boolean, default: false },
});

const ConfigurationSchema = new Schema<IConfiguration>(
  {
    basic: { type: BasicConfigSchema, required: true },
    rag: { type: RagConfigSchema, required: true },
    workflows: { type: WorkflowsConfigSchema, required: true },
    security: { type: SecurityConfigSchema, required: true },
  },
  { timestamps: true }
);

// Only create the model if it doesn't exist already (for hot reloading in Next.js)
export default mongoose.models.Configuration ||
  mongoose.model<IConfiguration>("Configuration", ConfigurationSchema);

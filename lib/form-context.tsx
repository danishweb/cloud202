"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { type FormValues } from "./schemas";

interface FormContextType {
  formState: FormValues;
  updateBasic: (data: Partial<FormValues["basic"]>) => void;
  updateRag: (data: Partial<FormValues["rag"]>) => void;
  updateWorkflows: (data: Partial<FormValues["workflows"]>) => void;
  updateSecurity: (data: Partial<FormValues["security"]>) => void;
  isBasicStepValid: () => boolean;
  isRagStepValid: () => boolean;
  isWorkflowsStepValid: () => boolean;
  isSecurityStepValid: () => boolean;
  addConfiguration: (config: Record<string, string>) => void;
  removeConfiguration: (index: number) => void;
  resetForm: () => void;
}

const defaultFormState: FormValues = {
  basic: {
    appName: "",
    description: "",
  },
  rag: {
    knowledgeBaseName: "",
    description: "",
    pattern: "",
    embeddings: "",
    metrics: "",
    chunking: "",
    vectorDb: "",
    configurations: [],
  },
  workflows: {
    selectedWorkflows: [],
  },
  security: {
    enableEncryption: false,
    enableAudit: false,
    enableRBAC: false,
  },
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<FormValues>(defaultFormState);

  const updateBasic = (data: Partial<FormValues["basic"]>) => {
    setFormState((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        ...data,
      },
    }));
  };

  const updateRag = (data: Partial<FormValues["rag"]>) => {
    setFormState((prev) => ({
      ...prev,
      rag: {
        ...prev.rag,
        ...data,
      },
    }));
  };

  const updateWorkflows = (data: Partial<FormValues["workflows"]>) => {
    setFormState((prev) => ({
      ...prev,
      workflows: {
        ...prev.workflows,
        ...data,
      },
    }));
  };

  const updateSecurity = (data: Partial<FormValues["security"]>) => {
    setFormState((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        ...data,
      },
    }));
  };

  const addConfiguration = (config: Record<string, string>) => {
    setFormState((prev) => ({
      ...prev,
      rag: {
        ...prev.rag,
        configurations: [...(prev.rag.configurations || []), config],
      },
    }));
  };

  const removeConfiguration = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      rag: {
        ...prev.rag,
        configurations:
          prev.rag.configurations?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const isBasicStepValid = () => {
    return (
      formState.basic.appName.trim() !== "" &&
      formState.basic.description.trim() !== ""
    );
  };

  const isRagStepValid = () => {
    return (
      formState.rag.knowledgeBaseName.trim() !== "" &&
      formState.rag.description.trim() !== "" &&
      formState.rag.vectorDb.trim() !== ""
    );
  };

  const isWorkflowsStepValid = () => {
    return true;
  };

  const isSecurityStepValid = () => {
    return true;
  };

  const resetForm = () => {
    setFormState(defaultFormState);
  };

  return (
    <FormContext.Provider
      value={{
        formState,
        updateBasic,
        updateRag,
        updateWorkflows,
        updateSecurity,
        isBasicStepValid,
        isRagStepValid,
        isWorkflowsStepValid,
        isSecurityStepValid,
        addConfiguration,
        removeConfiguration,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

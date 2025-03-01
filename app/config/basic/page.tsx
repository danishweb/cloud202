"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer } from "@/components/ui/form-container";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/lib/form-context";
import { basicFormSchema, type BasicFormValues } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function BasicConfigPage() {
  const router = useRouter();
  const { formState, updateBasic } = useFormContext();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      appName: "",
      description: "",
    },
  });

  // Load existing values from context when component mounts
  useEffect(() => {
    if (formState.basic) {
      form.reset(formState.basic);
    }
  }, [form, formState.basic]);

  // Handle form submission
  function onSubmit(data: BasicFormValues) {
    // Update form context with validated data
    updateBasic(data);

    // Navigate to next step
    router.push("/config/rag");
  }

  const handleNext = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Basic configuration" />

      <FormContainer nextHref="/config/rag" onNext={handleNext}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="My awesome app" {...field} />
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </FormContainer>
    </div>
  );
}

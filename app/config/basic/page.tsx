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
import { Button } from "@/components/ui/button";
import { Database, FileText, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const optionButtons = [
  {
    id: "datasets",
    title: "Datasets",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: "data-sources",
    title: "Data sources",
    icon: <Database className="h-6 w-6" />,
  },
  {
    id: "prompt-template",
    title: "Prompt template",
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

export default function BasicConfigPage() {
  const router = useRouter();
  const { formState, updateBasic } = useFormContext();

  const form = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      appName: "",
      description: "",
    },
  });

  useEffect(() => {
    if (formState.basic) {
      form.reset(formState.basic);
    }
  }, [form, formState.basic]);

  function onSubmit(data: BasicFormValues) {
    updateBasic(data);

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

            {/* Option Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4">
              {optionButtons.map((button) => (
                <Dialog key={button.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-16 flex items-center justify-center gap-2"
                    >
                      {button.icon}
                      <span>{button.title}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{button.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center">
                      <p>-</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </form>
        </Form>
      </FormContainer>
    </div>
  );
}

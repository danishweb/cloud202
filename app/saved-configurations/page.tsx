"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2, ArrowLeft } from "lucide-react";

interface Configuration {
  _id: string;
  basic: {
    appName: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SavedConfigurationsPage() {
  const router = useRouter();
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/configurations");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch configurations");
      }

      setConfigurations(result.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) {
      return;
    }

    try {
      const response = await fetch(`/api/configurations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete configuration");
      }

      // Refresh the list
      fetchConfigurations();
    } catch (err) {
      console.error("Error deleting configuration:", err);
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleView = (id: string) => {
    router.push(`/saved-configurations/${id}`);
  };

  const columns: ColumnDef<Configuration>[] = [
    {
      accessorKey: "basic.appName",
      header: "App Name",
    },
    {
      accessorKey: "basic.description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.basic.description;
        return (
          <div className="max-w-xs truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original._id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <PageHeader title="Saved Configurations" />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-card rounded-md border shadow-sm p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : configurations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No configurations saved yet.</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/config/basic")}
            >
              Create New Configuration
            </Button>
          </div>
        ) : (
          <DataTable columns={columns} data={configurations} />
        )}
      </div>
    </div>
  );
}

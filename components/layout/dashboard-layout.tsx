"use client";

import { useFormContext } from "@/lib/form-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Icons
import {
  Eye,
  FileCode,
  GitBranch,
  Lock,
  Settings,
  ShieldCheck
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Basic config",
    href: "/config/basic",
    icon: <Settings className="w-4 h-4 mr-2" />,
  },
  {
    title: "RAG",
    href: "/config/rag",
    icon: <FileCode className="w-4 h-4 mr-2" />,
  },
  {
    title: "Workflows",
    href: "/config/workflows",
    icon: <GitBranch className="w-4 h-4 mr-2" />,
  },
  {
    title: "Security Overview",
    href: "/config/security",
    icon: <ShieldCheck className="w-4 h-4 mr-2" />,
  },
  {
    title: "Overview",
    href: "/config/overview",
    icon: <Eye className="w-4 h-4 mr-2" />,
  },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    isBasicStepValid,
    isRagStepValid,
    isWorkflowsStepValid,
    isSecurityStepValid,
  } = useFormContext();

  // Logic to determine which steps are available based on form completion
  const canAccessRag = isBasicStepValid();
  const canAccessWorkflows = canAccessRag && isRagStepValid();
  const canAccessSecurity = canAccessWorkflows && isWorkflowsStepValid();
  const canAccessOverview = canAccessSecurity && isSecurityStepValid();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <div className="flex items-center p-4 border-b"></div>

        <div className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Configuration Steps
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              // Determine if the step is accessible
              const isAccessible =
                item.href === "/config/basic" ||
                (item.href === "/config/rag" && canAccessRag) ||
                (item.href === "/config/workflows" && canAccessWorkflows) ||
                (item.href === "/config/security" && canAccessSecurity) ||
                (item.href === "/config/overview" && canAccessOverview);

              return isAccessible ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ) : (
                <div
                  key={item.href}
                  className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground/40 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {item.title}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

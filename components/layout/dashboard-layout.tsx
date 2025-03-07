"use client";

import { useFormContext } from "@/lib/form-context";
import { ReactNode } from "react";
 
import {
  Eye,
  FileCode,
  GitBranch,
  Lock,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "./app-sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Basic Configuration",
    href: "/config/basic",
    icon: <Settings className="w-4 h-4 mr-2" />,
  },
  {
    title: "RAG Configuration",
    href: "/config/rag",
    icon: <FileCode className="w-4 h-4 mr-2" />,
  },
  {
    title: "Workflows",
    href: "/config/workflows",
    icon: <GitBranch className="w-4 h-4 mr-2" />,
  },
  {
    title: "Security",
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
  const {
    isBasicStepValid,
    isRagStepValid,
    isWorkflowsStepValid,
    isSecurityStepValid,
  } = useFormContext();
 
  const canAccessRag = isBasicStepValid();
  const canAccessWorkflows = canAccessRag && isRagStepValid();
  const canAccessSecurity = canAccessWorkflows && isWorkflowsStepValid();
  const canAccessOverview = canAccessSecurity && isSecurityStepValid();
 
  const processedNavItems = navItems.map((item) => { 
    const isAccessible =
      item.href === "/config/basic" ||
      (item.href === "/config/rag" && canAccessRag) ||
      (item.href === "/config/workflows" && canAccessWorkflows) ||
      (item.href === "/config/security" && canAccessSecurity) ||
      (item.href === "/config/overview" && canAccessOverview);

    return {
      ...item,
      isAccessible, 
      displayIcon: isAccessible ? item.icon : <Lock className="w-4 h-4 mr-2" />,
    };
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Desktop sidebar with validation logic */}
      <div className="hidden md:block">
        <AppSidebar
          navItems={processedNavItems.map((item) => ({
            title: item.title,
            href: item.isAccessible ? item.href : "#",
            icon: item.displayIcon,
            disabled: !item.isAccessible,
          }))}
          className="shrink-0"
        />
      </div>

      {/* Mobile sidebar without validation */}
      <div className="block md:hidden">
        <AppSidebar navItems={navItems} className="shrink-0" />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 transition-all duration-200 ease-in-out">
        {children}
      </main>
    </div>
  );
}

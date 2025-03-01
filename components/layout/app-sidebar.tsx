"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  disabled?: boolean;
};

interface AppSidebarProps {
  navItems: NavItem[];
  className?: string;
}

// Menu items.
const items: NavItem[] = [
  {
    title: "Home",
    href: "#",
    icon: <Home />,
  },
  {
    title: "Inbox",
    href: "#",
    icon: <Inbox />,
  },
  {
    title: "Calendar",
    href: "#",
    icon: <Calendar />,
  },
  {
    title: "Search",
    href: "#",
    icon: <Search />,
  },
  {
    title: "Settings",
    href: "#",
    icon: <Settings />,
  },
];

export function AppSidebar({ navItems = items, className }: AppSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile overlay - only appears when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - different styles for mobile vs desktop */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-0",
          className
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-semibold text-sidebar-foreground">Cloud202</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            item.disabled ? (
              <div
                key={item.href}
                className="flex items-center px-3 py-2 text-sm rounded-md text-sidebar-foreground/40 cursor-not-allowed"
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </Link>
            )
          ))}
        </nav>
      </div>
    </>
  );
}

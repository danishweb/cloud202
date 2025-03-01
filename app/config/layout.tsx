"use client";

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FormProvider } from '@/lib/form-context';
import { RouteProtection } from '@/components/route-protection';

export default function ConfigLayout({ children }: { children: ReactNode }) {
  return (
    <FormProvider>
      <RouteProtection>
        <DashboardLayout>{children}</DashboardLayout>
      </RouteProtection>
    </FormProvider>
  );
}

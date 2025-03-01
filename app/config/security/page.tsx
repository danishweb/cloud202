"use client";

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { FormContainer } from '@/components/ui/form-container';
import { useFormContext } from '@/lib/form-context';

export default function SecurityConfigPage() {
  const router = useRouter();
  const { updateSecurity } = useFormContext();

  const handleNext = () => {
    // Save empty security data
    updateSecurity({
      enableEncryption: false,
      enableAudit: false,
      enableRBAC: false
    });
    router.push('/config/overview');
  };

  const handlePrev = () => {
    router.push('/config/workflows');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Security Overview" />
      
      <FormContainer 
        prevHref="/config/workflows" 
        nextHref="/config/overview"
        onNext={handleNext}
        onPrev={handlePrev}
      >
        <div className="flex items-center justify-center h-64 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">-</p>
        </div>
      </FormContainer>
    </div>
  );
}

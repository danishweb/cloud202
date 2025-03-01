import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FormContainerProps {
  children: ReactNode;
  prevHref?: string;
  nextHref?: string;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
  customNextButton?: ReactNode;
  customPrevButton?: ReactNode;
}

export function FormContainer({
  children,
  prevHref,
  nextHref,
  onNext,
  onPrev,
  className,
  customNextButton,
  customPrevButton,
}: FormContainerProps) {
  const router = useRouter();

  return (
    <div className={cn("bg-card rounded-md border shadow-sm w-full", className)}>
      <div className="p-4 md:p-6">{children}</div>

      <div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        {customPrevButton ? (
          customPrevButton
        ) : prevHref || onPrev ? (
          <Button
            variant="secondary"
            className="w-full sm:w-auto order-2 sm:order-1"
            onClick={() => {
              if (onPrev) {
                onPrev();
              } else if (prevHref) {
                router.push(prevHref);
              }
            }}
          >
            Previous
          </Button>
        ) : (
          <div className="order-2 sm:order-1"></div> // Empty div to maintain flex layout
        )}

        {customNextButton ? (
          customNextButton
        ) : nextHref || onNext ? (
          <Button
            className="w-full sm:w-auto order-1 sm:order-2"
            onClick={() => {
              if (onNext) {
                onNext();
                // Navigation is handled by the onNext callback
              } else if (nextHref) {
                router.push(nextHref);
              }
            }}
          >
            {nextHref === undefined && onNext ? "Submit" : "Next"}
          </Button>
        ) : (
          <div className="order-1 sm:order-2"></div> // Empty div to maintain flex layout
        )}
      </div>
    </div>
  );
}

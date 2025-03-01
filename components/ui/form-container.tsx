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
    <div className={cn("bg-card rounded-md border shadow-sm", className)}>
      <div className="p-6">{children}</div>

      <div className="p-4 bg-muted/20 border-t flex justify-between">
        {customPrevButton ? (
          customPrevButton
        ) : prevHref || onPrev ? (
          <Button
            variant="secondary"
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
          <div></div> // Empty div to maintain flex layout
        )}

        {customNextButton ? (
          customNextButton
        ) : nextHref || onNext ? (
          <Button
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
          <div></div> // Empty div to maintain flex layout
        )}
      </div>
    </div>
  );
}

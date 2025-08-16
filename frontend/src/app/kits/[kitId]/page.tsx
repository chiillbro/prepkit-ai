// frontend/src/app/kits/[kitId]/page.tsx
"use client";

import { KitDisplay } from "@/components/organisms/kit-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetKitByIdQuery } from "@/lib/redux/features/kits-api-slice";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function KitPage() {
  const params = useParams();
  const kitId = params.kitId as string;

  const {
    data: kit,
    isLoading,
    isError,
    error,
  } = useGetKitByIdQuery(kitId, {
    skip: !kitId, // Don't run the query if kitId is not available yet
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Failed to Load Kit</AlertTitle>
          <AlertDescription>
            {/* You can add more error details here */}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!kit) {
    return <div>Kit not found.</div>; // Or a more elegant 404 component
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <KitDisplay kit={kit} />
    </main>
  );
}

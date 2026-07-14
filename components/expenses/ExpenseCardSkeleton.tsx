import { Skeleton } from "@/components/ui/Skeleton";

export function ExpenseCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-paper-line bg-white">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-2 border-t border-paper-line pt-3">
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}

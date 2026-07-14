import { Skeleton } from "@/components/ui/Skeleton";

export function ExpenseTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-paper-line bg-white">
      <div className="divide-y divide-paper-line">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ExpenseDetailLoading() {
  return (
    <div className="bg-paper py-14 sm:py-20">
      <Container className="max-w-4xl">
        <Skeleton className="h-4 w-32" />
        <div className="mt-6 rounded-2xl border border-paper-line bg-white p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-9 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
            </div>
            <Skeleton className="h-9 w-24 shrink-0" />
          </div>
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-8 h-72 w-full rounded-xl" />
        </div>
      </Container>
    </div>
  );
}

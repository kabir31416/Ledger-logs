"use client";

import { FiUser, FiMail, FiCalendar } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data, isLoading } = useDashboardStats();

  if (!user) {
    return (
      <div className="bg-paper py-20">
        <Container className="max-w-xl">
          <Skeleton className="h-40 w-full rounded-2xl" />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-paper py-14 sm:py-20">
      <Container className="max-w-xl">
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Profile</h1>

        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-lg font-semibold text-primary-dark">
              {initials(user.name)}
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{user.name}</h2>
              <p className="text-sm text-ink/50">Member since {formatDate(user.createdAt)}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t border-paper-line pt-6">
            <div className="flex items-center gap-3">
              <FiUser className="text-ink/40" size={16} />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Name</dt>
                <dd className="text-sm font-medium text-ink">{user.name}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-ink/40" size={16} />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Email</dt>
                <dd className="text-sm font-medium text-ink">{user.email}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCalendar className="text-ink/40" size={16} />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Joined</dt>
                <dd className="text-sm font-medium text-ink">{formatDate(user.createdAt, "long")}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-paper-line pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/40">Total logged</dt>
              <dd className="font-amount mt-1 text-lg font-semibold text-ink">
                {isLoading || !data ? <Skeleton className="h-6 w-20" /> : formatCurrency(data.totalExpenses)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/40">Entries</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {isLoading || !data ? <Skeleton className="h-6 w-12" /> : data.totalCount}
              </dd>
            </div>
          </div>

          <Button variant="outline" className="mt-8 w-full" onClick={() => logout()}>
            Log out
          </Button>
        </Card>
      </Container>
    </div>
  );
}

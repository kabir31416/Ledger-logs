import Link from "next/link";
import { FiInbox } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ExpenseNotFound() {
  return (
    <div className="bg-paper py-24">
      <Container className="max-w-lg">
        <EmptyState
          icon={<FiInbox size={22} />}
          title="That expense doesn't exist"
          description="It may have been deleted, or the link is incorrect."
          action={
            <Link href="/explore">
              <Button variant="primary">Back to Explore</Button>
            </Link>
          }
        />
      </Container>
    </div>
  );
}

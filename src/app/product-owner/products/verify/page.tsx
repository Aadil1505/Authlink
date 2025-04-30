import { authCheck } from "@/lib/actions/auth";
import { getVerifications } from "@/lib/actions/verifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search as SearchIcon } from "lucide-react";
import { format } from "date-fns";

export default async function Page() {
  const session = await authCheck();

  if (!session.dbId) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Session Error</h2>
          <p className="text-muted-foreground">
            Unable to verify user session.
          </p>
        </div>
      </div>
    );
  }

  const { data: verifications, error } = await getVerifications(session.dbId);

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading verifications</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verify Products</h1>
          <p className="text-muted-foreground">
            Manage and monitor product verifications
          </p>
        </div>
        <Button>
          <SearchIcon className="mr-2 h-4 w-4" />
          New Verification
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <Input className="max-w-sm" placeholder="Search verifications..." />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Verifications Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Verification ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications?.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell className="font-medium">
                  VER-{verification.id}
                </TableCell>
                <TableCell>{verification.product_name}</TableCell>
                <TableCell>
                  {format(new Date(verification.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      verification.status === "confirmed"
                        ? "default"
                        : verification.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {verification.status}
                  </Badge>
                </TableCell>
                <TableCell>{verification.details || "-"}</TableCell>
                <TableCell>
                  {verification.evidence_url?.length ? (
                    <div className="flex gap-2">
                      {verification.evidence_url.map(
                        (url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Evidence {index + 1}
                          </a>
                        )
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!verifications?.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No verifications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

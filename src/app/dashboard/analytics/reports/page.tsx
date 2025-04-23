import { getAllReports } from "@/lib/actions/analytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ReportsPage() {
  // For now, we'll just get the first page of reports
  const { transactions } = await getAllReports(10, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "verification" ? "bg-blue-500" : "bg-orange-500";
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Transaction Reports
          </h1>
          <p className="text-muted-foreground">
            View all product verification and fraud reports
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.product_name}
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(transaction.transaction_type)}>
                    {transaction.transaction_type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.reported_by}</TableCell>
                <TableCell>
                  {format(new Date(transaction.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

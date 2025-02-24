import { authCheck } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search as SearchIcon } from "lucide-react";

// Sample data
const verifications = [
  {
    id: "VER001",
    product: "Luxury Watch Model X",
    date: "2024-02-20",
    status: "verified",
  },
  {
    id: "VER002",
    product: "Designer Handbag Y",
    date: "2024-02-19",
    status: "pending",
  },
  {
    id: "VER003",
    product: "Smartphone Z Pro",
    date: "2024-02-18",
    status: "failed",
  },
  // Add more sample verifications...
];

export default async function Page() {
  await authCheck();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verify Products</h1>
          <p className="text-muted-foreground">Manage and monitor product verifications</p>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell className="font-medium">{verification.id}</TableCell>
                <TableCell>{verification.product}</TableCell>
                <TableCell>{verification.date}</TableCell>
                <TableCell>
                  <Badge variant={verification.status === 'verified' ? 'default' : verification.status === 'pending' ? 'secondary' : 'destructive'}>
                    {verification.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
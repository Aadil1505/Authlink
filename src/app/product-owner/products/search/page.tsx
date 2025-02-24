import { authCheck } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search as SearchIcon } from "lucide-react";

// Sample data
const products = [
  {
    id: "PRD001",
    name: "Luxury Watch Model X",
    category: "Luxury",
    registrationDate: "2024-02-20",
    status: "active",
  },
  {
    id: "PRD002",
    name: "Designer Handbag Y",
    category: "Fashion",
    registrationDate: "2024-02-19",
    status: "active",
  },
  {
    id: "PRD003",
    name: "Smartphone Z Pro",
    category: "Electronics",
    registrationDate: "2024-02-18",
    status: "inactive",
  },
  // Add more sample products...
];

export default async function Page() {
  await authCheck();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Products</h1>
          <p className="text-muted-foreground">Find and manage your registered products</p>
        </div>
        <Button>
          <SearchIcon className="mr-2 h-4 w-4" />
          New Search
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <Input className="max-w-sm" placeholder="Search products..." />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.registrationDate}</TableCell>
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
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


import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
    await authCheck()
  return (
    <div className="container mx-auto py-10">
      <BatchOperations />
    </div>
  )
}

const BatchOperations = () => {
  const mockBatchProducts = [
    { id: "1", name: "Product A", totalSupply: 100, authenticated: 45 },
    { id: "2", name: "Product B", totalSupply: 200, authenticated: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Batch Operations</h1>
        <Card>
          <CardHeader>
            <CardTitle>Upload Products in Bulk</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
                <Input type="file" />
              </div>
              <Button type="submit">Upload</Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Batch Products</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Supply</TableHead>
                <TableHead>Authenticated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatchProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.totalSupply}</TableCell>
                  <TableCell>{product.authenticated}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};


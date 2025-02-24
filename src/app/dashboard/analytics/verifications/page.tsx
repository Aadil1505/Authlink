import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VerificationStats = () => {
  const mockData = [
    { product: "Product A", verifications: 300 },
    { product: "Product B", verifications: 450 },
    { product: "Product C", verifications: 200 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Verification Stats</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Verification Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Verifications</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.product}</TableCell>
                    <TableCell>{data.verifications}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationStats;


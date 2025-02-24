import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FraudDetection = () => {
  const mockData = [
    { product: "Product A", fraudCases: 2 },
    { product: "Product B", fraudCases: 1 },
    { product: "Product C", fraudCases: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Fraud Detection</h1>
        <Card>
          <CardHeader>
            <CardTitle>Suspicious Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Fraud Cases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.product}</TableCell>
                    <TableCell>{data.fraudCases}</TableCell>
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

export default FraudDetection;


import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
    await authCheck()
  return (
    <div className="container mx-auto py-10">
      <AnalyticsOverview />
    </div>
  )
}

const AnalyticsOverview = () => {
  const mockData = [
    { metric: "Total Products", value: 1200 },
    { metric: "Verified Products", value: 950 },
    { metric: "Fraudulent Activities", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Analytics Overview</h1>
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.metric}</TableCell>
                    <TableCell>{data.value}</TableCell>
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
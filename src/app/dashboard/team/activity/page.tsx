import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ActivityLog = () => {
  const mockData = [
    { member: "John Doe", action: "Created a new product", date: "2025-02-20" },
    { member: "Jane Smith", action: "Edited product details", date: "2025-02-21" },
    { member: "Bob Johnson", action: "Viewed product catalog", date: "2025-02-22" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Activity Log</h1>
        <Card>
          <CardHeader>
            <CardTitle>Track Team Member Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.member}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.date}</TableCell>
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

export default ActivityLog;


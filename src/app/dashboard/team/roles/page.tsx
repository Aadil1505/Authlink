import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
    await authCheck()
  return (
    <div className="container mx-auto py-10">
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-8">Team Roles</h1>
          <Card>
            <CardHeader>
              <CardTitle>Configure Access Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((role, index) => (
                    <TableRow key={index}>
                      <TableCell>{role.role}</TableCell>
                      <TableCell>{role.permissions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const mockData = [
  { role: "Admin", permissions: "Full Access" },
  { role: "Editor", permissions: "Edit Content" },
  { role: "Viewer", permissions: "View Content" },
];


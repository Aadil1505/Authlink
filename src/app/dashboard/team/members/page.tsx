import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TeamMembers = () => {
  const mockData = [
    { name: "John Doe", role: "Admin", email: "john@example.com" },
    { name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { name: "Bob Johnson", role: "Viewer", email: "bob@example.com" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Team Members</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
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

export default TeamMembers;


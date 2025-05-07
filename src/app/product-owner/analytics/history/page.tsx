"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";

interface Verification {
  id: number;
  user_id: number;
  product_id: string;
  product_name: string;
  verified_at: string;
}

export default function VerificationHistory() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerifications() {
      try {
        const result = await fetch('/api/verifications');
        const data = await result.json();
        setVerifications(data);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVerifications();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification History</h1>
          <p className="text-muted-foreground">Track all product verifications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
          <CardDescription>
            View all authenticity checks performed on products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search verifications..." className="pl-8" />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="shrink-0">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Verification Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : verifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No verifications found</TableCell>
                  </TableRow>
                ) : (
                  verifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>{verification.product_id}</TableCell>
                      <TableCell>{verification.product_name}</TableCell>
                      <TableCell>{verification.user_id}</TableCell>
                      <TableCell>{new Date(verification.verified_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
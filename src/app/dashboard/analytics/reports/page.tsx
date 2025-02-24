import React from 'react';
import { authCheck } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function Page() {
    await authCheck()
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Generate Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Custom Analytics Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Report Name</label>
                <Input type="text" placeholder="Enter report name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Range</label>
                <Input type="date" />
              </div>
              <Button type="submit">Generate Report</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


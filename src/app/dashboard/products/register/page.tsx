import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RegisterProduct = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Register New Product</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <Input type="text" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Input type="text" placeholder="Enter product category" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Supply</label>
                <Input type="number" placeholder="Enter total supply" />
              </div>
              <Button type="submit">Register Product</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterProduct;

/*"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, Users, Settings } from 'lucide-react';
import LogoutButton from "@/components/forms/LogoutButton"; // Import the LogoutButton component

export const UserDashboard = () => {
  const [selectedTab, setSelectedTab] = React.useState("products");

  const mockProducts = [
    { id: "1", name: "Product A", totalSupply: 100, authenticated: 45 },
    { id: "2", name: "Product B", totalSupply: 200, authenticated: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex space-x-4">
            <Button>View Profile</Button>
            <LogoutButton /> {/* Add the LogoutButton component */}
  /*        </div>
        </div>
        <div className="flex">
          {/* Sidebar */}
/*          <div className="w-64 bg-white h-screen p-4 space-y-4">
            <div className="font-bold text-xl mb-8">Dashboard</div>
            <div className="space-y-2">
              <Button 
                variant={selectedTab === "products" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setSelectedTab("products")}
              >
                <Package2 className="mr-2 h-4 w-4" />
                Products
              </Button>
              <Button 
                variant={selectedTab === "users" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setSelectedTab("users")}
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
              <Button 
                variant={selectedTab === "settings" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setSelectedTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Main Content */}
 /*         <div className="flex-1 p-8">
            {selectedTab === "products" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Products</h2>
                  <Button>Add New Product</Button>
                </div>
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
                    {mockProducts.map((product) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

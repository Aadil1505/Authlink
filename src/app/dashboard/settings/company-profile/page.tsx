import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit3 } from "lucide-react";

const CompanyProfilePage = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
                    <p className="text-muted-foreground">Manage company information here.</p>
                </div>
                <Button>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Update your company details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <Input type="text" placeholder="Enter company name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <Input type="text" placeholder="Enter company address" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                            <Input type="email" placeholder="Enter contact email" />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyProfilePage;
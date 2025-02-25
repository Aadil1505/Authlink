import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Key } from "lucide-react";

const ApiKeysPage = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground">Manage API access here.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generate New Key
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing API Keys</CardTitle>
                    <CardDescription>Manage your existing API keys below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Key 1</span>
                            </div>
                            <Button variant="outline" size="sm">Revoke</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Key 2</span>
                            </div>
                            <Button variant="outline" size="sm">Revoke</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApiKeysPage;
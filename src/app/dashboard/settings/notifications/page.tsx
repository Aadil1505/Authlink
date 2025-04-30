import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bell } from "lucide-react";

const NotificationsPage = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">Configure alert settings here.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Email Notifications</span>
                            </div>
                            <input type="checkbox" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">SMS Notifications</span>
                            </div>
                            <input type="checkbox" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationsPage;
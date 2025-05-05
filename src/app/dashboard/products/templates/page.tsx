"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTemplatesPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    manufacturer_id: "",
    category: "",
    features: "",
    specifications: "",
    image_url: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add submit logic
    alert("Template submitted! (No backend yet)");
  };

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Product Template</CardTitle>
          <CardDescription>
            Use this page to create and manage product templates. Templates can
            be used to quickly register new products with predefined fields and
            settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Template Name"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter template description..."
                rows={3}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Manufacturer ID</label>
              <Input
                name="manufacturer_id"
                value={form.manufacturer_id}
                onChange={handleChange}
                placeholder="MFR-123"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Category</label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Features (comma separated)
              </label>
              <Input
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="feature1, feature2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Specifications (JSON)
              </label>
              <Textarea
                name="specifications"
                value={form.specifications}
                onChange={handleChange}
                className="font-mono"
                rows={2}
                placeholder='{"color":"red","size":"M"}'
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <Input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price</label>
              <Input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Create Template
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p>
            Fill in the template details and submit the form. You can use
            templates to quickly register new products with predefined fields
            and settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

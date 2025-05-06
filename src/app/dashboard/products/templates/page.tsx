"use client";
import React, { useState, useEffect } from "react";
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
import { registerTemplate, getAllTemplates } from "@/lib/actions/templates";
import { authCheck } from "@/lib/actions/auth";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateTemplatesPage() {
  const [allTemplates, setAllTemplates] = useState<{ name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      const res = await getAllTemplates();
      if (res.success && res.templates) {
        setAllTemplates(res.templates.map((t: any) => ({ name: t.name })));
      }
    }
    fetchTemplates();
  }, []);

  // Zod schema for template form (all fields required)
  const templateSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      manufacturer_code: z.string().min(1, "Manufacturer code is required"),
      category: z.string().min(1, "Category is required"),
      features: z.string().min(1, "Features are required"),
      image_url: z.string().url("Image URL must be a valid URL"),
      price: z.string().min(1, "Price is required"),
      specifications: z
        .array(z.object({ key: z.string().min(1), value: z.string().min(1) }))
        .min(1, "At least one specification is required"),
    })
    .refine(
      (data) => {
        // This will be replaced in handleSubmit for async check
        return true;
      },
      {
        message: "Template name must be unique.",
        path: ["name"],
      }
    );

  type TemplateFormValues = z.infer<typeof templateSchema>;

  // Use React Hook Form with Zod
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      manufacturer_code: "",
      category: "",
      features: "",
      image_url: "",
      price: "",
      specifications: [{ key: "", value: "" }],
    },
  });

  useEffect(() => {
    async function setManufacturerId() {
      const user = await authCheck();
      console.log("User from authCheck:", user);
      if (user.manufacturer_code) {
        form.setValue("manufacturer_code", user.manufacturer_code);
      }
    }
    setManufacturerId();
  }, [form]);

  const addSpecification = () => {
    const specs = form.getValues("specifications");
    form.setValue("specifications", [...specs, { key: "", value: "" }]);
  };

  const removeSpecification = (idx: number) => {
    const specs = form.getValues("specifications");
    if (specs.length > 1) {
      form.setValue(
        "specifications",
        specs.filter((_, i) => i !== idx)
      );
    }
  };

  const handleSubmit = async (values: TemplateFormValues) => {
    // Check for unique name
    if (
      allTemplates.some(
        (t) => t.name.trim().toLowerCase() === values.name.trim().toLowerCase()
      )
    ) {
      setError(
        "A template with this name already exists. Please choose a different name."
      );
      return;
    }
    setSubmitting(true);
    setMessage(null);
    setError(null);
    // Convert features to array
    const featuresArr = values.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    // Convert specifications array to object
    const specsObj: Record<string, string> = {};
    values.specifications.forEach(({ key, value }) => {
      if (key) specsObj[key] = value;
    });
    // Prepare payload
    const payload = {
      name: values.name,
      description: values.description,
      manufacturer_code: values.manufacturer_code,
      category: values.category,
      features: featuresArr,
      specifications: specsObj,
      image_url: values.image_url,
      price: Number(values.price),
    };
    console.log("Submitting template payload:", payload);
    try {
      const result = await registerTemplate(payload);
      if (result.success) {
        setMessage("Template created successfully!");
        form.reset();
        // Repopulate manufacturer_code after reset
        const user = await authCheck();
        if (user.manufacturer_code) {
          form.setValue("manufacturer_code", user.manufacturer_code);
        }
      } else {
        setError(result.error || "Failed to create template.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input {...form.register("name")} placeholder="Template Name" />
              {form.formState.errors.name && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.name.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea
                {...form.register("description")}
                placeholder="Enter template description..."
                rows={3}
              />
              {form.formState.errors.description && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.description.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Manufacturer Code
              </label>
              <Input
                {...form.register("manufacturer_code")}
                readOnly
                className="bg-gray-50"
              />
              {form.formState.errors.manufacturer_code && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.manufacturer_code.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Category</label>
              <Input {...form.register("category")} placeholder="Category" />
              {form.formState.errors.category && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.category.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Features (comma separated)
              </label>
              <Input
                {...form.register("features")}
                placeholder="feature1, feature2"
              />
              {form.formState.errors.features && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.features.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Specifications</label>
              <div className="space-y-2">
                {form.watch("specifications").map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      {...form.register(`specifications.${idx}.key` as const)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Value"
                      {...form.register(`specifications.${idx}.value` as const)}
                      className="w-1/2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSpecification(idx)}
                      disabled={form.watch("specifications").length === 1}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addSpecification}
                  className="mt-1"
                >
                  + Add Specification
                </Button>
              </div>
              {form.formState.errors.specifications && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.specifications.message as string}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <Input
                {...form.register("image_url")}
                placeholder="https://..."
              />
              {form.formState.errors.image_url && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.image_url.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Price</label>
              <Input
                {...form.register("price")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
              {form.formState.errors.price && (
                <div className="text-red-600 text-xs pt-1">
                  {form.formState.errors.price.message}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full mt-4" disabled={submitting}>
              {submitting ? "Creating..." : "Create Template"}
            </Button>
            {message && (
              <div className="text-green-600 text-sm pt-2">{message}</div>
            )}
            {error && <div className="text-red-600 text-sm pt-2">{error}</div>}
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

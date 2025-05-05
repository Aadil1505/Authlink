"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  type CompleteRegistrationResponse,
  type ProductInfo,
  registerComplete,
} from "@/lib/actions/registration";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import { getAllTemplates } from "@/lib/actions/templates";
import { authCheck } from "@/lib/actions/auth";

// Define the form schema with Zod
const formSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Product ID must be alphanumeric"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  manufacturerId: z
    .string()
    .min(1, "Manufacturer ID is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Manufacturer ID must be alphanumeric"),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  price: z.string().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterNfcTag() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompleteRegistrationResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Add these states for templates
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      name: "",
      description: "",
      manufacturerId: "",
      category: "",
      features: [],
      image_url: "",
      price: "",
      specifications: {},
    },
  });

  // Fetch templates for the current user on mount
  useEffect(() => {
    async function fetchTemplates() {
      const user = await authCheck();
      console.log("Current user:", user);
      const res = await getAllTemplates();
      console.log("All templates response:", res);
      if (res.success && res.templates && user.id) {
        const filtered = res.templates.filter((t: any) => {
          console.log("Comparing", t.manufacturer_id, "to", user.id);
          return String(t.manufacturer_id) === String(user.id);
        });
        setTemplates(filtered);
        console.log("Filtered templates for user:", filtered);
      } else {
        setTemplates([]);
        console.log("No templates found or user not authenticated");
      }
    }
    fetchTemplates();
  }, []);

  // When a template is selected, fill the form
  useEffect(() => {
    if (!selectedTemplateId) return;
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      form.setValue("name", template.name ?? "");
      form.setValue("description", template.description ?? "");
      form.setValue(
        "manufacturerId",
        template.manufacturer_id ? String(template.manufacturer_id) : ""
      );
      form.setValue("category", template.category ?? "");
      form.setValue("features", template.features ?? []);
      form.setValue("image_url", template.image_url ?? "");
      form.setValue("price", template.price ?? "");
      form.setValue(
        "specifications",
        typeof template.specifications === "string"
          ? JSON.parse(template.specifications)
          : template.specifications ?? {}
      );
    }
  }, [selectedTemplateId, templates, form]);

  async function onSubmit(values: FormValues) {
    const submitValues = {
      ...values,
      specifications: JSON.stringify(values.specifications ?? {}),
    };
    try {
      setLoading(true);
      setError(null);
      setShowDetails(false);

      // Call the complete registration server action with form values
      const response = await registerComplete(submitValues);

      if (response.success) {
        setResult(response);

        // Only reset form on fully successful registration
        if (
          response.blockchainRegistration?.success &&
          response.productRegistration?.success
        ) {
          form.reset();
        }
      } else {
        setError(
          response.error ||
            "Registration failed without a specific error message"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string | undefined) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add toast notification here
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>NFC Tag Registration</CardTitle>
          <CardDescription>
            Register and personalize your NTAG424 DNA tag with product
            information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Dropdown */}
          {templates.length > 0 ? (
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Choose a Template
              </label>
              <select
                className="input w-full"
                value={selectedTemplateId ?? ""}
                onChange={(e) =>
                  setSelectedTemplateId(Number(e.target.value) || null)
                }
              >
                <option value="">-- Select a template --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4 text-sm text-gray-500">
              No templates found for your account.
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-12345" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the unique identifier for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smart Device X1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description..."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="MFR-789" {...field} />
                    </FormControl>
                    <FormDescription>
                      The ID of the manufacturer for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Feature1, Feature2"
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? e.target.value.split(",").map((f) => f.trim())
                              : []
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="499.95" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specifications"
                render={({ field }) => {
                  // Always work with an object
                  const specs =
                    field.value && typeof field.value === "object"
                      ? field.value
                      : {};
                  const entries = Object.entries(specs);

                  const handleChange = (
                    idx: number,
                    key: string,
                    value: string
                  ) => {
                    const newSpecs = { ...specs };
                    const oldKey = entries[idx][0];
                    if (oldKey !== key) {
                      delete newSpecs[oldKey];
                    }
                    newSpecs[key] = value;
                    field.onChange(newSpecs);
                  };

                  const handleAdd = () => {
                    field.onChange({ ...specs, "": "" });
                  };

                  const handleRemove = (key: string) => {
                    const newSpecs = { ...specs };
                    delete newSpecs[key];
                    field.onChange(newSpecs);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Specifications</FormLabel>
                      <div className="space-y-2">
                        {entries.map(([key, value], idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Key"
                              value={key}
                              onChange={(e) =>
                                handleChange(idx, e.target.value, value)
                              }
                              className="w-1/3"
                            />
                            <Input
                              placeholder="Value"
                              value={value}
                              onChange={(e) =>
                                handleChange(idx, key, e.target.value)
                              }
                              className="w-1/2"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleRemove(key)}
                              className="px-2"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAdd}
                        >
                          Add Specification
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register NFC Tag"}
              </Button>
            </form>
          </Form>

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {error === "No card detected" && (
                  <p className="mt-2 text-sm">
                    Please place an NFC tag on the reader and try again.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Registration Result */}
          {result && result.success && (
            <Alert
              variant="default"
              className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
            >
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                <div className="space-y-1">
                  {/* Step 1: NFC Tag Registration */}
                  <p>
                    NFC Tag has been successfully registered and personalized.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">UID:</span>
                    <code className="px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded">
                      {result.uid}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.uid)}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      aria-label="Copy UID to clipboard"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {result.isFactory
                      ? "Factory tag personalized"
                      : "Tag updated"}
                  </p>
                  <p>
                    <span className="font-medium">Message:</span>{" "}
                    {result.message}
                  </p>

                  {/* Step 2: Blockchain Registration */}
                  {result.blockchainRegistration?.success ? (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium mb-1">
                            Blockchain Registration Successful
                          </p>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                Transaction:
                              </span>
                              <code className="text-xs px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded truncate max-w-[240px]">
                                {result.blockchainRegistration.transaction}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    result.blockchainRegistration?.transaction
                                  )
                                }
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                aria-label="Copy transaction ID to clipboard"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {showDetails && (
                              <>
                                {result.blockchainRegistration
                                  .productAccount && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      Product Account:
                                    </span>
                                    <code className="text-xs px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded truncate max-w-[240px]">
                                      {
                                        result.blockchainRegistration
                                          .productAccount
                                      }
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          result.blockchainRegistration
                                            ?.productAccount
                                        )
                                      }
                                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                      aria-label="Copy product account to clipboard"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )}

                                {result.blockchainRegistration.owner && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      Owner:
                                    </span>
                                    <code className="text-xs px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded truncate max-w-[240px]">
                                      {result.blockchainRegistration.owner}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          result.blockchainRegistration?.owner
                                        )
                                      }
                                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                      aria-label="Copy owner address to clipboard"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    Product ID:
                                  </span>
                                  <code className="text-xs px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded">
                                    {result.blockchainRegistration.productId}
                                  </code>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    NFC ID:
                                  </span>
                                  <code className="text-xs px-1 py-0.5 bg-green-100 dark:bg-green-900 rounded">
                                    {result.blockchainRegistration.nfcId}
                                  </code>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1"
                        >
                          {showDetails ? (
                            <>
                              <span className="text-xs">Less</span>
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <span className="text-xs">More</span>
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    result.blockchainRegistration && (
                      <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Blockchain Registration Failed:
                            </p>
                            <p className="text-sm mt-1">
                              {result.blockchainRegistration.error}
                            </p>

                            {result.blockchainRegistration.details &&
                              result.blockchainRegistration.details.length >
                                0 && (
                                <div className="mt-2">
                                  <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm flex items-center gap-1"
                                  >
                                    {showDetails ? (
                                      <>
                                        <span>Hide details</span>
                                        <ChevronUp className="h-4 w-4" />
                                      </>
                                    ) : (
                                      <>
                                        <span>Show details</span>
                                        <ChevronDown className="h-4 w-4" />
                                      </>
                                    )}
                                  </button>

                                  {showDetails && (
                                    <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded text-xs font-mono overflow-x-auto max-h-40">
                                      {result.blockchainRegistration.details.map(
                                        (line, i) => (
                                          <div key={i}>{line}</div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                            <p className="mt-2 text-sm">
                              The NFC tag was personalized but could not be
                              registered on the blockchain.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Step 3: Database Registration */}
                  {result.productRegistration?.success ? (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="font-medium mb-1">Database Registration</p>
                      <p className="text-sm">
                        {result.productRegistration.message}
                      </p>
                    </div>
                  ) : (
                    result.productRegistration && (
                      <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Database Registration Failed:
                            </p>
                            <p className="text-sm">
                              {result.productRegistration.error}
                            </p>

                            {result.blockchainRegistration?.success && (
                              <p className="mt-2 text-sm">
                                The NFC tag was personalized and registered on
                                the blockchain, but could not be saved to the
                                database.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p>
            Fill in the product details, place an NTAG424 DNA tag on the reader,
            then submit the form.
          </p>
          <p className="mt-1">
            This will personalize the tag, register it on the blockchain, and
            store the information in the database.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

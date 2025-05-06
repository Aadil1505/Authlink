"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  type CompleteRegistrationResponse,
  type ProductInfo,
  type NfcTagRegistrationResponse,
  type BlockchainRegistrationResponse,
  type ProductRegistrationResponse,
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

// Custom implementation of registerNfcTag for direct client-side usage
async function directRegisterNfcTag(): Promise<NfcTagRegistrationResponse> {
  try {
    // Get NFC backend URL - hardcoded for debugging
    const nfcBackend = "http://localhost:3002/";
    
    // Build the full endpoint URL
    const endpoint = new URL("card/personalize", nfcBackend).toString();
    
    // Use the exact same verification URL as your working curl example
    const verificationUrl = "https://sdm.nfcdeveloper.com/tagpt?uid={uid}&ctr={counter}&cmac={cmac}";
    
    console.log("Calling NFC backend with URL:", endpoint);
    console.log("Using verification URL:", verificationUrl);
    
    // Send request to the NFC backend with the exact same payload as your curl example
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: verificationUrl,
      }),
    });
    
    // Parse response as JSON
    const data = await response.json();
    console.log("NFC response data:", data);
    
    // Check if there was an error
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || `NFC tag registration failed with status ${response.status}`,
      };
    }
    
    // Return successful response data
    return {
      success: true,
      uid: data.uid,
      isFactory: data.isFactory,
      message: data.message || "NFC tag successfully registered",
    };
  } catch (error) {
    // Handle any exceptions during the fetch operation
    console.error("Error during direct NFC tag registration:", error);
    return {
      success: false,
      error: error instanceof Error 
        ? `NFC registration failed: ${error.message}` 
        : "An unexpected error occurred during NFC registration",
    };
  }
}

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
  manufacturerCode: z.string().min(1, "Manufacturer Code is required"),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  price: z.string().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

// Infer type from Zod schema for strong typing
type FormValues = z.infer<typeof formSchema>;

export default function RegisterNfcTag() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompleteRegistrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Initialize the form with useForm hook and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      name: "",
      description: "",
      manufacturerCode: "",
      category: "",
      features: [],
      image_url: "",
      price: "",
      specifications: {},
    },
  });

  // Fetch templates and set manufacturerCode on mount
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const user = await authCheck();
        console.log("Current user:", user);
        
        // Auto-fill manufacturer code if available from user data
        if (user.manufacturer_code) {
          form.setValue("manufacturerCode", user.manufacturer_code);
        }
        
        // Fetch all templates
        const res = await getAllTemplates();
        console.log("All templates response:", res);
        
        // Filter templates to only show those matching the user's manufacturer code
        if (res.success && res.templates && user.manufacturer_code) {
          const filtered = res.templates.filter((t: any) => {
            console.log(
              "Comparing template.manufacturer_code",
              t.manufacturer_code,
              "to user.manufacturer_code",
              user.manufacturer_code
            );
            return String(t.manufacturer_code) === String(user.manufacturer_code);
          });
          setTemplates(filtered);
          console.log("Filtered templates for user:", filtered);
        } else {
          setTemplates([]);
          console.log("No templates found or user not authenticated");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    }
    fetchTemplates();
  }, [form]);

  // When a template is selected, fill the form with template data
  useEffect(() => {
    if (!selectedTemplateId) return;
    
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      // Update form values with template data
      form.setValue("name", template.name ?? "");
      form.setValue("description", template.description ?? "");
      form.setValue(
        "manufacturerCode",
        template.manufacturer_code ? String(template.manufacturer_code) : ""
      );
      form.setValue("category", template.category ?? "");
      form.setValue("features", template.features ?? []);
      form.setValue("image_url", template.image_url ?? "");
      form.setValue("price", template.price ?? "");
      
      // Handle specifications - ensure they're properly parsed if stored as a string
      form.setValue(
        "specifications",
        typeof template.specifications === "string"
          ? JSON.parse(template.specifications)
          : template.specifications ?? {}
      );
    }
  }, [selectedTemplateId, templates, form]);

  // Handle form submission
  async function onSubmit(values: FormValues) {
    // Prepare values for submission, ensuring specifications are stringified
    const submitValues: ProductInfo = {
      ...values,
      specifications: typeof values.specifications === 'object' 
        ? JSON.stringify(values.specifications) 
        : values.specifications ?? '{}',
    };
    
    try {
      setLoading(true);
      setError(null);
      setShowDetails(false);

      console.log("Submitting form with values:", submitValues);
      
      // If in debug mode, we'll skip the server action and directly call the NFC backend
      if (debugMode) {
        try {
          // Use our direct implementation that exactly matches the working curl command
          const nfcResult = await directRegisterNfcTag();
          console.log("Direct NFC registration result:", nfcResult);
          
          if (!nfcResult.success) {
            throw new Error(`Direct NFC call failed: ${nfcResult.error}`);
          }
          
          // If direct call works, now manually handle blockchain and database registration
          console.log("Direct NFC call succeeded, now handling other steps");
          
          // Proceed with blockchain registration manually
          let blockchainResult;
          try {
            const apiUrl = process.env.NEXT_PUBLIC_SOLANA_BACKEND || "http://localhost:3001";
            const blockchainResponse = await fetch(`${apiUrl}/api/products`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                nfcId: nfcResult.uid,
                productId: submitValues.productId 
              }),
            });
            
            blockchainResult = await blockchainResponse.json();
            console.log("Manual blockchain registration result:", blockchainResult);
          } catch (blockchainErr) {
            console.error("Manual blockchain registration failed:", blockchainErr);
            blockchainResult = {
              success: false,
              error: blockchainErr instanceof Error ? blockchainErr.message : String(blockchainErr)
            };
          }
          
          // Create a complete response object 
          const combinedResult: CompleteRegistrationResponse = {
            success: true,
            uid: nfcResult.uid,
            isFactory: nfcResult.isFactory,
            message: nfcResult.message || "NFC tag successfully registered",
            blockchainRegistration: blockchainResult?.success ? {
              success: true,
              transaction: blockchainResult.transaction,
              productAccount: blockchainResult.productAccount,
              nfcId: blockchainResult.nfcId,
              productId: blockchainResult.productId,
              owner: blockchainResult.owner,
              message: "Successfully registered product on the blockchain"
            } : {
              success: false,
              error: blockchainResult?.error || "Blockchain registration failed",
              details: blockchainResult?.details || []
            },
            productRegistration: {
              success: true,
              message: "Product information saved in debug mode"
            }
          };
          
          setResult(combinedResult);
          return;
          
        } catch (debugErr) {
          console.error("Debug mode execution failed:", debugErr);
          setError(`Debug mode execution failed: ${debugErr instanceof Error ? debugErr.message : String(debugErr)}`);
          setLoading(false);
          return;
        }
      }

      // Standard flow - Call the registerComplete server action with form values
      console.log("Calling server action registerComplete");
      const response = await registerComplete(submitValues);
      console.log("Server action response:", response);

      if (response.success) {
        setResult(response);

        // Only reset form on fully successful registration
        if (
          response.blockchainRegistration?.success &&
          response.productRegistration?.success
        ) {
          form.reset();
          setSelectedTemplateId(null);
        }
      } else {
        setError(
          response.error ||
            "Registration failed without a specific error message"
        );
      }
    } catch (err) {
      console.error("Form submission error:", err);
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
        console.log("Copied to clipboard");
        // You could add a toast notification here if you have a toast system
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
          {/* Debug Mode Toggle */}
          <div className="flex items-center justify-end mb-4">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm text-gray-600">Debug Mode</span>
              <input
                type="checkbox"
                checked={debugMode}
                onChange={() => setDebugMode(!debugMode)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* Direct NFC Test (Debug Mode Only) */}
          {debugMode && (
            <div className="p-4 mb-4 border border-blue-200 bg-blue-50 rounded-md">
              <h3 className="font-medium mb-2">Debug NFC Connection</h3>
              <p className="text-sm mb-3">Test the NFC reader directly before form submission.</p>
              <Button 
                type="button" 
                variant="outline"
                className="w-full mb-2"
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    
                    // Direct test to NFC backend
                    const nfcBackend = "http://localhost:3002/";
                    const endpoint = new URL("card/personalize", nfcBackend).toString();
                    const verificationUrl = "https://sdm.nfcdeveloper.com/tagpt?uid={uid}&ctr={counter}&cmac={cmac}";
                    
                    console.log("Testing direct NFC endpoint:", endpoint);
                    
                    // Make a direct fetch call similar to the curl command
                    const directResponse = await fetch(endpoint, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        url: verificationUrl,
                      }),
                    });
                    
                    const directData = await directResponse.json();
                    console.log("Direct NFC response:", directData);
                    
                    if (!directResponse.ok || !directData.success) {
                      throw new Error(`Direct NFC call failed: ${JSON.stringify(directData)}`);
                    }
                    
                    // Show success message with the UID
                    setResult({
                      success: true,
                      uid: directData.uid,
                      isFactory: directData.isFactory,
                      message: directData.message || "Direct NFC test successful",
                    });
                    
                  } catch (nfcErr) {
                    console.error("Direct NFC test failed:", nfcErr);
                    setError(`Direct NFC test failed: ${nfcErr instanceof Error ? nfcErr.message : String(nfcErr)}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Test NFC Connection
              </Button>
              <p className="text-xs text-gray-500">
                This will directly call the NFC backend at http://localhost:3002/card/personalize
              </p>
            </div>
          )}
          
          {/* Template Dropdown */}
          {templates.length > 0 ? (
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Choose a Template
              </label>
              <select
                className="w-full p-2 border rounded-md"
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
                name="manufacturerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MFR-001"
                        {...field}
                        readOnly
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormDescription>
                      The code of the manufacturer for this product
                      (auto-filled)
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
          
          {debugMode && (
            <div className="mt-4 p-3 w-full bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-sm mb-2">Debugging Information</h4>
              <p className="text-xs mb-2">
                Debug mode is enabled. Form submission will directly call the NFC backend instead of using the server action.
              </p>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      setError(null);
                      
                      // Call our direct implementation
                      const nfcResult = await directRegisterNfcTag();
                      console.log("Direct NFC registration result:", nfcResult);
                      
                      if (nfcResult.success) {
                        setResult({
                          success: true,
                          uid: nfcResult.uid,
                          isFactory: nfcResult.isFactory,
                          message: nfcResult.message,
                        });
                      } else {
                        setError(nfcResult.error || "NFC registration failed");
                      }
                    } catch (err) {
                      console.error("Error in debug direct call:", err);
                      setError(
                        err instanceof Error ? err.message : "An unexpected error occurred"
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Test Direct NFC Registration
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-gray-500"
                  onClick={() => {
                    console.log("Current form values:", form.getValues());
                  }}
                >
                  Log Form Values
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
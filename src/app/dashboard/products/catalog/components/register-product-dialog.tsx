"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  registerProductWithBlockchain,
  checkBlockchainHealth,
} from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  nfcId: z
    .string()
    .min(1, "NFC ID is required")
    .regex(
      /^NFC-424-\d{3}$/,
      "NFC ID must be in format NFC-424-XXX where X is a digit"
    )
    .transform((val) => val.toUpperCase()),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterProductDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      nfcId: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      // First check blockchain health
      await checkBlockchainHealth();

      // Then attempt registration
      await registerProductWithBlockchain("MANU_3", {
        name: values.name,
        description: values.description,
        nfcId: values.nfcId,
      });

      setOpen(false);
      form.reset();
      router.refresh();

      toast.success("Product registered successfully", {
        description:
          "Product has been registered on blockchain and in database",
      });
    } catch (error) {
      console.error("Error registering product:", error);

      // More specific error messages based on the error type
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        if (error.message.includes("blockchain")) {
          errorMessage = "Failed to register on blockchain. Please try again.";
        } else if (error.message.includes("database")) {
          errorMessage =
            "Database registration failed after blockchain registration.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Failed to register product", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Register New Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new product. The product
            will be registered on the blockchain and in our database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nfcId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFC Tag ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NFC-424-XXX"
                      {...field}
                      onChange={(e) => {
                        // Convert to uppercase and remove spaces
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/\s/g, "");
                        field.onChange(value);
                      }}
                    />
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
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

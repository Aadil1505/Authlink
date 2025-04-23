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
import { registerProduct } from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  nfcId: z
    .string()
    .min(1, "NFC ID is required")
    .regex(
      /^NFC-424-\d{3}$/,
      "NFC ID must be in format NFC-424-XXX where X is a digit"
    ),
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
      // Using a hardcoded manufacturer code for now - you'll want to get this from the user's session
      await registerProduct("MANU_3", {
        name: values.name,
        description: values.description,
      });

      // TODO: Make a separate API call to assign the NFC tag to this product
      // You'll need to create a new function in your API to handle this

      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error registering product:", error);
      // You might want to show an error message to the user here
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
            Fill in the details below to register a new product.
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

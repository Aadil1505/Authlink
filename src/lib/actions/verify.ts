'use server'

type SuccessResponse = {
  uid: string;
  read_ctr: number;
  enc_mode: string;
}

export async function verifyTag(uid: string, ctr: string, cmac: string) {
  if (!uid || !ctr || !cmac) {
    return { error: "Missing required parameters (uid, ctr, or cmac)" };
  }
  
  try {
    const apiUrl = `${process.env.SDM_BACKEND}tagpt?uid=${uid}&ctr=${ctr}&cmac=${cmac}`;
    
    console.log("Calling API:", apiUrl);
    
    const response = await fetch(
      apiUrl, 
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if ('error' in data) {
      return { error: data.error };
    } else {
      return { result: data as SuccessResponse };
    }
  } catch (err: any) {
    const errorMessage = err.message || "An unknown error occurred";
    console.error("Error verifying tag:", err);
    return { error: errorMessage };
  }
}




// lib/actions/product.ts

type ProductData = {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  manufactureDate: string;
  imageUrl: string;
  price: string;
  category: string;
  authenticity: "verified" | "unverified";
  features: string[];
  specifications: Record<string, string>;
}

export async function getProductByUid(uid: string): Promise<{ product: ProductData | null; error?: string }> {
  try {
    // In a real implementation, you would fetch this data from an API or database
    // For now, we'll return mock data based on the UID
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const product: ProductData = {
      id: uid,
      name: "Premium Smart Watch X1",
      description: "The X1 Smart Watch is the perfect blend of style and technology. With advanced health tracking, long battery life, and a sleek design, it's the ideal companion for your active lifestyle.",
      manufacturer: "TechWear International",
      manufactureDate: "2024-02-15",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
      price: "$299.99",
      category: "Wearable Technology",
      authenticity: "verified",
      features: [
        "Heart rate monitoring",
        "Sleep tracking",
        "Water resistant (50m)",
        "7-day battery life",
        "Notification alerts",
        "Customizable watch faces",
        "GPS tracking",
        "Wireless charging"
      ],
      specifications: {
        "Display": "1.4\" AMOLED (450x450)",
        "Battery": "410mAh Li-ion",
        "Connectivity": "Bluetooth 5.2, Wi-Fi",
        "Sensors": "Accelerometer, Gyroscope, Optical HR, SpO2",
        "Dimensions": "42 x 42 x 10.9mm",
        "Weight": "32g (without strap)",
        "Compatibility": "iOS 12.0+, Android 6.0+",
        "Water Resistance": "5 ATM"
      }
    };
    
    return { product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { product: null, error: "Failed to fetch product information" };
  }
}
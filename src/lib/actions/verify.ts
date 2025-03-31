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
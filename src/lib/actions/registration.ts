'use server'

/**
 * Server action to register a new NFC tag with the personalization endpoint
 * This function sends a request to the NFC backend to personalize a tag
 * with a verification URL that includes placeholders for UID, counter, and CMAC
 * 
 * @returns {Promise<NfcTagRegistrationResponse>}
 */
export async function registerNfcTag(): Promise<NfcTagRegistrationResponse> {
  // Get NFC backend URL from environment variable
  const nfcBackend = process.env.NFC_BACKEND || 'http://localhost:3002/';
  
  // Build the full endpoint URL
  const endpoint = new URL('card/personalize', nfcBackend).toString();
  
  // Verification URL with placeholders for dynamic data
  const verificationUrl = 'http://10.25.130.96:3000/verification?uid={uid}&ctr={counter}&cmac={cmac}';
  
  try {
    // Send request to the NFC backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: verificationUrl
      }),
    });
    
    // Parse response as JSON
    const data = await response.json();
    
    // Check if there was an error
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`
      };
    }
    
    // Return successful response data
    return {
      success: data.success,
      uid: data.uid,
      isFactory: data.isFactory,
      message: data.message
    };
  } catch (error) {
    // Handle any exceptions during the fetch operation
    console.error('Error registering NFC tag:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}




export type NfcTagRegistrationResponse = 
  | {
      success: true;
      uid: string;
      isFactory: boolean;
      message: string;
    } 
  | {
      success: false;
      error: string;
    };
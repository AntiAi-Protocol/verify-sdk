export interface VerifyProofParams {
  /**
   * The unique cryptographic proof ID provided by the AntiAI Transparency Log.
   */
  proofId: string;
  /**
   * The SHA-256 hash of the media file being verified.
   */
  hash: string;
  /**
   * Optional environment target. Defaults to production.
   */
  environment?: 'production' | 'sandbox';
}

export interface VerificationResult {
  isValid: boolean;
  creatorId?: string;
  timestamp?: string;
  error?: string;
}

const API_BASE_URL = 'https://api.antiai.me/v1';

/**
 * Verifies a digital media asset against the AntiAI Transparency Log using Ed25519 signatures.
 * 
 * @param params - The proof ID and media hash to verify.
 * @returns A VerificationResult object indicating if the signature matches the content.
 */
export async function verifyProof(params: VerifyProofParams): Promise<VerificationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/verify?proofId=${params.proofId}&hash=${params.hash}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { isValid: false, error: 'Proof not found in transparency log.' };
      }
      throw new Error(`Verification API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      isValid: data.isValid,
      creatorId: data.creatorId,
      timestamp: data.timestamp,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown verification error occurred.'
    };
  }
}

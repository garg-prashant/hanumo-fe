// Authentication service for handling Privy JWT tokens and backend integration
import { User } from '@privy-io/react-auth';

export interface PrivyIdToken {
  // Privy JWT token payload
  sub: string;                    // Privy user ID
  aud: string;                    // Audience (your app)
  iss: string;                    // Issuer (Privy)
  iat: number;                    // Issued at timestamp
  exp: number;             
         // Expiration timestamp
  
  // User data embedded in token
  email?: string;
  email_verified?: boolean;
  wallet_address?: string;
  wallet_chain_id?: number;
  wallet_client?: string;
  
  // Social login data
  google_id?: string;
  google_email?: string;
  google_name?: string;
  google_picture?: string;
  
  twitter_id?: string;
  twitter_username?: string;
  twitter_name?: string;
  twitter_profile_image_url?: string;
  
  discord_id?: string;
  discord_username?: string;
  discord_discriminator?: string;
  discord_avatar?: string;
}

export interface BackendAuthPayload {
  // Your backend's JWT token for API authentication
  accessToken: string;
  
  // User data extracted from Privy token
  user: {
    privyId: string;
    email?: string;
    walletAddress?: string;
    displayName?: string;
    avatar?: string;
    loginMethod: string;
  };
  
  // Session information
  session: {
    expiresAt: string;
    refreshToken?: string;
  };
}

export class AuthService {
  /**
   * Get Privy ID token and authenticate with backend
   */
  static async authenticateWithBackend(user: User, getAccessToken: () => Promise<string>): Promise<BackendAuthPayload> {
    try {
      // Get Privy's signed JWT token
      let privyIdToken: string;
      try {
        privyIdToken = await getAccessToken();
        console.log('🔐 Privy ID Token:', privyIdToken);
        console.log('🔐 Token length:', privyIdToken?.length);
        console.log('🔐 Token starts with:', privyIdToken?.substring(0, 20));
        
        // Decode token to see payload (for debugging)
        const tokenPayload = this.decodeJWT(privyIdToken);
        console.log('📊 Token Payload:', tokenPayload);
      } catch (tokenError) {
        console.warn('⚠️ Could not get Privy token, using mock token for testing:', tokenError);
        privyIdToken = 'mock_token_for_testing';
        console.log('🔄 Using mock token:', privyIdToken);
      }
      
      // Send Privy token to backend for verification
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privyIdToken, // Send the signed JWT token (or mock token)
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend response error:', errorText);
        throw new Error(`Backend authentication failed: ${response.statusText}`);
      }

      const authPayload: BackendAuthPayload = await response.json();
      
      // 🚀 COMPREHENSIVE TOKEN LOGGING FOR TESTING
      console.log('🎯 ===== AUTHENTICATION SUCCESSFUL =====');
      console.log('🔐 Privy ID Token (from frontend):', privyIdToken);
      console.log('🔑 Backend Access Token (JWT):', authPayload.accessToken);
      console.log('👤 User Data:', authPayload.user);
      console.log('⏰ Session Expires At:', authPayload.session.expiresAt);
      console.log('🔄 Refresh Token:', authPayload.session.refreshToken);
      console.log('🎯 ======================================');
      
      // 🧪 SIMPLE TOKEN VARIABLE FOR TESTING
      const bearerToken = authPayload.accessToken;
      console.log('🧪 BEARER TOKEN FOR TESTING:', bearerToken);
      
      // Store authentication data in localStorage for persistence
      localStorage.setItem('hanumo_auth', JSON.stringify(authPayload));
      
      return authPayload;
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }

  /**
   * Decode JWT token (for debugging purposes)
   */
  static decodeJWT(token: string): PrivyIdToken | null {
    try {
      if (!token || typeof token !== 'string') {
        console.warn('Invalid token provided to decodeJWT:', token);
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT format:', token);
        return null;
      }
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  /**
   * Get stored authentication data
   */
  static getStoredAuth(): BackendAuthPayload | null {
    try {
      const stored = localStorage.getItem('hanumo_auth');
      if (!stored) return null;
      
      const authData = JSON.parse(stored);
      
      // Check if token is still valid
      if (new Date(authData.session.expiresAt) < new Date()) {
        this.clearStoredAuth();
        return null;
      }
      
      return authData;
    } catch (error) {
      console.error('Error reading stored auth:', error);
      this.clearStoredAuth();
      return null;
    }
  }

  /**
   * Clear stored authentication data
   */
  static clearStoredAuth(): void {
    localStorage.removeItem('hanumo_auth');
  }

  /**
   * Make authenticated API requests
   */
  static async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const authData = this.getStoredAuth();
    
    if (!authData) {
      throw new Error('No authentication data found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authData.accessToken}`,
      ...options.headers,
    };

    return fetch(endpoint, {
      ...options,
      headers,
    });
  }

  /**
   * Get user's display name from available data
   */
  static getUserDisplayName(user: User): string {
    // Priority order: Google name > Twitter name > Discord name > Email > Wallet address
    if (user.google?.name) return user.google.name;
    if (user.twitter?.name) return user.twitter.name;
    if (user.discord?.username) return user.discord.username;
    if (user.email?.address) return user.email.address.split('@')[0];
    if (user.wallet?.address) return this.formatAddress(user.wallet.address);
    
    return 'Anonymous User';
  }

  /**
   * Get user's avatar URL from available data
   */
  static getUserAvatar(user: User): string | null {
    if (user.google?.picture) return user.google.picture;
    if (user.twitter?.profileImageUrl) return user.twitter.profileImageUrl;
    if (user.discord?.avatar) return `https://cdn.discordapp.com/avatars/${user.discord.id}/${user.discord.avatar}.png`;
    
    return null;
  }

  /**
   * Format wallet address for display
   */
  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Check if user has verified email
   */
  static isEmailVerified(user: User): boolean {
    return user.email?.verified || false;
  }

  /**
   * Get user's primary identifier (wallet address or email)
   */
  static getPrimaryIdentifier(user: User): string {
    if (user.wallet?.address) return user.wallet.address;
    if (user.email?.address) return user.email.address;
    
    return user.id; // Fallback to Privy ID
  }
}

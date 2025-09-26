# 🔐 Privy JWT Authentication Flow Guide

## Overview

This guide explains the secure JWT-based authentication flow using Privy's ID tokens for backend verification.

## 🔄 Secure Authentication Flow

### 1. **Frontend Process**
```
User Login → Privy Authentication → Get ID Token → Send to Backend → Receive Backend JWT
```

### 2. **Backend Verification**
```
Receive Privy Token → Verify with Privy Secret → Extract User Data → Generate Backend JWT → Return Auth Payload
```

## 🔑 JWT Token Structure

### **Privy ID Token (from Frontend)**
```typescript
{
  "sub": "cmfyc5hpa005el40cc5k9ilbj_user_123",    // Privy User ID
  "aud": "cmfyc5hpa005el40cc5k9ilbj",             // Your App ID
  "iss": "https://auth.privy.io",                  // Privy Issuer
  "iat": 1642680000,                              // Issued at
  "exp": 1642683600,                              // Expires at
  
  // User data (embedded in token)
  "email": "user@example.com",
  "email_verified": true,
  "wallet_address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "wallet_chain_id": 1,
  "wallet_client": "metamask",
  
  // Social login data
  "google_id": "google_user_123",
  "google_email": "user@gmail.com",
  "google_name": "John Doe",
  "google_picture": "https://lh3.googleusercontent.com/...",
  
  "twitter_id": "twitter_user_123",
  "twitter_username": "johndoe",
  "twitter_name": "John Doe",
  "twitter_profile_image_url": "https://pbs.twimg.com/...",
  
  "discord_id": "discord_user_123",
  "discord_username": "johndoe",
  "discord_discriminator": "1234",
  "discord_avatar": "avatar_hash"
}
```

### **Your Backend JWT (returned to Frontend)**
```typescript
{
  "privyId": "cmfyc5hpa005el40cc5k9ilbj_user_123",
  "userId": "user_123",                           // Your internal user ID
  "walletAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "email": "user@example.com",
  "loginMethod": "wallet",
  "iat": 1642680000,
  "exp": 1643284800
}
```

## 🚀 Implementation Details

### **Frontend Code**
```typescript
import { usePrivy } from '@privy-io/react-auth';
import { AuthService } from '@/lib/auth';

function MyComponent() {
  const { authenticated, user, getIdToken } = usePrivy();
  
  const handleLogin = async () => {
    if (authenticated && user) {
      // Get Privy's signed JWT token
      const privyIdToken = await getIdToken();
      
      // Send to backend for verification
      const authPayload = await AuthService.authenticateWithBackend(user, getIdToken);
      
      // Now you have your backend JWT for API calls
      console.log('Backend JWT:', authPayload.accessToken);
    }
  };
}
```

### **Backend Verification**
```typescript
// /api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const { privyIdToken } = await request.json();
  
  // Verify Privy's JWT token
  const privyTokenPayload = jwt.verify(privyIdToken, PRIVY_APP_SECRET);
  
  // Extract user data from verified token
  const privyId = privyTokenPayload.sub;
  const email = privyTokenPayload.email;
  const walletAddress = privyTokenPayload.wallet_address;
  
  // Create/update user in your database
  const userRecord = await manageUserRecord(privyTokenPayload);
  
  // Generate your backend JWT
  const accessToken = jwt.sign({
    privyId,
    userId: userRecord.id,
    walletAddress,
    email,
  }, JWT_SECRET, { expiresIn: '7d' });
  
  return NextResponse.json({
    accessToken,
    user: userRecord,
    session: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
  });
}
```

## 🔒 Security Benefits

### **1. Token Verification**
- ✅ **Cryptographically Signed:** Privy signs tokens with their secret
- ✅ **Tamper-Proof:** Cannot be modified without detection
- ✅ **Expiration:** Tokens expire automatically
- ✅ **Audience Validation:** Ensures token is for your app

### **2. No Raw Data Transmission**
- ✅ **No Plaintext:** User data is embedded in signed JWT
- ✅ **Verified Source:** Backend can trust the data source
- ✅ **Single Source of Truth:** Privy is the authoritative source

### **3. Backend Control**
- ✅ **Your JWT:** Generate your own tokens for API access
- ✅ **Custom Claims:** Add your own user data
- ✅ **Session Management:** Control token expiration
- ✅ **Revocation:** Can invalidate tokens if needed

## 📊 Data Flow Example

### **Step 1: User Logs In**
```typescript
// Frontend gets Privy user object
const user = {
  id: "cmfyc5hpa005el40cc5k9ilbj_user_123",
  wallet: { address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" },
  email: { address: "user@example.com", verified: true }
};

// Get Privy's JWT token
const privyIdToken = await getIdToken();
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Step 2: Send to Backend**
```typescript
// Frontend sends Privy token to backend
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ privyIdToken })
});
```

### **Step 3: Backend Verification**
```typescript
// Backend verifies Privy token
const privyTokenPayload = jwt.verify(privyIdToken, PRIVY_APP_SECRET);

// Extracted data:
{
  sub: "cmfyc5hpa005el40cc5k9ilbj_user_123",
  email: "user@example.com",
  wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  // ... other verified data
}
```

### **Step 4: Generate Backend JWT**
```typescript
// Backend creates its own JWT
const accessToken = jwt.sign({
  privyId: "cmfyc5hpa005el40cc5k9ilbj_user_123",
  userId: "user_123",
  walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  email: "user@example.com"
}, JWT_SECRET, { expiresIn: '7d' });
```

### **Step 5: Return to Frontend**
```typescript
// Backend returns authentication payload
{
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    privyId: "cmfyc5hpa005el40cc5k9ilbj_user_123",
    email: "user@example.com",
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    displayName: "John Doe",
    id: "user_123"
  },
  session: {
    expiresAt: "2024-01-27T15:45:00Z"
  }
}
```

## 🛠️ Environment Setup

### **Required Environment Variables**
```bash
# Frontend (public)
NEXT_PUBLIC_PRIVY_APP_ID=cmfyc5hpa005el40cc5k9ilbj

# Backend (private)
PRIVY_APP_SECRET=your_privy_app_secret_here
JWT_SECRET=your_backend_jwt_secret_here
```

### **Getting Privy App Secret**
1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Select your app
3. Go to "Settings" → "API Keys"
4. Copy the "App Secret" (not the App ID)

## 🎯 Use Cases for Your Rental Platform

### **Property Listings**
```typescript
// Make authenticated API calls
const response = await AuthService.makeAuthenticatedRequest('/api/properties', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Property',
    price: '100',
    ownerWallet: authData.user.walletAddress
  })
});
```

### **User Profile Management**
```typescript
// Update user profile
const response = await AuthService.makeAuthenticatedRequest('/api/user/profile', {
  method: 'PUT',
  body: JSON.stringify({
    displayName: 'John Doe',
    bio: 'Web3 enthusiast'
  })
});
```

### **Rental Transactions**
```typescript
// Create rental agreement
const response = await AuthService.makeAuthenticatedRequest('/api/rentals', {
  method: 'POST',
  body: JSON.stringify({
    propertyId: 'prop_123',
    tenantWallet: authData.user.walletAddress,
    amount: '100',
    duration: '30'
  })
});
```

## 🔍 Debugging

### **Frontend Console Logs**
- `🔐 Privy ID Token:` - Shows the raw Privy JWT
- `📊 Token Payload:` - Shows decoded token data
- `✅ Backend authentication successful:` - Shows backend response

### **Backend Console Logs**
- `✅ Privy token verified:` - Shows verified token payload
- `📊 Extracted user data:` - Shows extracted user information
- `✅ Authentication successful for user:` - Shows successful authentication

## 🚀 Next Steps

1. **Get Privy App Secret** from your dashboard
2. **Add to environment variables** in `.env.local`
3. **Test the authentication flow** with different login methods
4. **Implement your database** for user management
5. **Add API routes** for your rental platform features

This JWT-based approach ensures secure, verifiable authentication between your frontend and backend! 🎉

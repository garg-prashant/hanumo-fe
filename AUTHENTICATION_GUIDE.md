# 🔐 Privy Authentication & Backend Integration Guide

## Overview

This guide explains how Privy authentication works and what data is available for your backend integration.

## 🔄 Authentication Flow

### 1. **User Login Process**
```
User clicks "Connect Wallet" → Privy Modal Opens → User Authenticates → Frontend Receives User Data → Backend Authentication
```

### 2. **Data Flow**
```
Privy User Object → AuthService.extractUserData() → Backend API → JWT Token → Frontend Storage
```

## 📊 User Data Available from Privy

When a user logs in, Privy provides the following data structure:

```typescript
interface PrivyUser {
  id: string;                    // Unique Privy user ID
  createdAt: string;            // Account creation timestamp
  
  // Wallet Information
  wallet?: {
    address: string;            // Ethereum wallet address
    chainId: number;            // Connected chain ID
    walletClient: string;       // Wallet type (metamask, coinbase_wallet, etc.)
  };
  
  // Email Information
  email?: {
    address: string;            // Email address
    verified: boolean;          // Email verification status
  };
  
  // Social Login Information
  google?: {
    id: string;                // Google user ID
    email: string;              // Google email
    name: string;               // Full name
    picture?: string;           // Profile picture URL
  };
  
  twitter?: {
    id: string;                // Twitter user ID
    username: string;           // Twitter handle
    name: string;               // Display name
    profileImageUrl?: string;   // Profile image URL
  };
  
  discord?: {
    id: string;                // Discord user ID
    username: string;           // Discord username
    discriminator: string;      // Discord discriminator
    avatar?: string;            // Avatar hash
  };
}
```

## 🚀 Backend Integration

### **What Gets Sent to Your Backend:**

```typescript
// POST /api/auth/login
{
  "user": {
    "privyId": "cmfyc5hpa005el40cc5k9ilbj_user_123",
    "wallet": {
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      "chainId": 1,
      "walletClient": "metamask"
    },
    "email": {
      "address": "user@example.com",
      "verified": true
    },
    "google": {
      "id": "google_user_123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "picture": "https://lh3.googleusercontent.com/..."
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-20T15:45:00Z"
  },
  "timestamp": "2024-01-20T15:45:00Z"
}
```

### **What Your Backend Should Return:**

```typescript
// Response from /api/auth/login
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",              // Your internal user ID
    "privyId": "cmfyc5hpa005el40cc5k9ilbj_user_123",
    "walletAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "email": "user@example.com",
    "profile": {
      "displayName": "John Doe",
      "avatar": "https://lh3.googleusercontent.com/...",
      "bio": "Web3 enthusiast"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-20T15:45:00Z"
  },
  "session": {
    "expiresAt": "2024-01-27T15:45:00Z",
    "refreshToken": "refresh_token_here"
  }
}
```

## 🔧 Implementation Examples

### **Frontend Usage:**

```typescript
import { usePrivy } from '@privy-io/react-auth';
import { AuthService } from '@/lib/auth';

function MyComponent() {
  const { authenticated, user, login, logout } = usePrivy();
  
  const handleLogin = async () => {
    if (authenticated && user) {
      // Extract user data for backend
      const userData = AuthService.extractUserData(user);
      
      // Send to backend
      const authPayload = await AuthService.authenticateWithBackend(user);
      
      // Now you have JWT token for API calls
      console.log('Access Token:', authPayload.accessToken);
    }
  };
  
  return (
    <button onClick={login}>
      Connect Wallet
    </button>
  );
}
```

### **Backend API Route:**

```typescript
// /api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const { user } = await request.json();
  
  // 1. Check if user exists in your database
  const existingUser = await findUserByPrivyId(user.privyId);
  
  // 2. Create or update user record
  const userRecord = existingUser 
    ? await updateUserLastLogin(user.privyId)
    : await createUserRecord(user);
  
  // 3. Generate JWT token
  const accessToken = jwt.sign(
    {
      privyId: user.privyId,
      userId: userRecord.id,
      walletAddress: user.wallet?.address,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // 4. Return authentication payload
  return NextResponse.json({
    accessToken,
    user: userRecord,
    session: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
  });
}
```

### **Making Authenticated API Calls:**

```typescript
// Using the AuthService
const response = await AuthService.makeAuthenticatedRequest('/api/properties', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Property',
    price: '100',
    // ... other property data
  })
});
```

## 🔒 Security Considerations

### **JWT Token Structure:**
```typescript
{
  "privyId": "cmfyc5hpa005el40cc5k9ilbj_user_123",
  "userId": "user_123",
  "walletAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "iat": 1642680000,
  "exp": 1643284800
}
```

### **Backend Validation:**
```typescript
// Verify JWT token in your API routes
function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

## 📱 User Experience Features

### **Display Name Priority:**
1. Google name (if available)
2. Twitter name (if available)
3. Discord username (if available)
4. Email username (if available)
5. Wallet address (formatted)

### **Avatar Priority:**
1. Google profile picture
2. Twitter profile image
3. Discord avatar
4. Default avatar (if none available)

## 🎯 Use Cases for Your Rental Platform

### **Property Listing:**
- **Wallet Address:** For receiving rental payments
- **Email:** For notifications and communication
- **Social Profiles:** For reputation and verification

### **User Verification:**
- **Email Verification:** Required for property listings
- **Wallet Ownership:** Verified through Privy
- **Social Profiles:** Additional trust signals

### **Payment Processing:**
- **Wallet Address:** Direct crypto payments
- **Chain ID:** Ensure correct network
- **Wallet Client:** Optimize UX for specific wallets

## 🚀 Next Steps

1. **Set up your backend API** using the provided examples
2. **Configure JWT secrets** in your environment variables
3. **Test the authentication flow** with different login methods
4. **Implement user profile management** in your database
5. **Add property listing functionality** with authenticated users

## 🔍 Debugging

Check the browser console for detailed logs:
- `🔐 Authenticating with backend...`
- `📊 User data from Privy:`
- `📤 Sending to backend:`
- `✅ Backend authentication successful:`

This will help you see exactly what data is being sent to your backend!

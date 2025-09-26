import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains';

// Configure Wagmi for Privy
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
});

// Privy configuration with your App ID
export const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmfyc5hpa005el40cc5k9ilbj';

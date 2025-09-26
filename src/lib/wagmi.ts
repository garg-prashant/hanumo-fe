import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Hanumo - Web3 Rental Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1f2e3d4c5b6a7980', // Fallback demo ID
  chains: [mainnet, polygon, arbitrum, sepolia],
  ssr: true,
});

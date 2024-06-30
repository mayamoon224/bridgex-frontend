import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { bscTestnet, sepolia } from "viem/chains";

const queryClient = new QueryClient();

const projectId = "0bfca40764165ba695999e2fd233b5be";

const metadata = {
  name: "OpenDEX",
  description:
    "OpenDEX is a decentralized exchange for trading tokens on the OpenGPU blockchain.",
  url: "https://web3modal.com",
  icons: ["/logo.png"],
};

let openGPU = {
  id: 201720082023,
  network: "OpenGPU Chain",
  name: "OpenGPU Chain",
  nativeCurrency: { name: "OpenGPU", symbol: "oGPU", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://nerpc.ogpuscan.io"],
    },
    public: {
      http: ["https://nerpc.ogpuscan.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "OpenGPU Scan",
      url: "https://devnet.ogpuscan.io/",
    },
  },
};
const chains = [openGPU, bscTestnet, sepolia];

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // enableEmail: true,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  themeMode: "light",
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

import { ethers } from "ethers";
import { useWalletClient } from "wagmi";

interface WalletClientData {
  account: string | any;
  chain: any;
  transport: any;
}

export const useSigner = (): ethers.Signer | null => {
  const { data: walletClient } = useWalletClient();

  if (!walletClient) return null;

  const { account, chain, transport }: WalletClientData = walletClient;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  };

  const provider = new ethers.providers.Web3Provider(transport);
  const signer = provider.getSigner(account.address);

  return signer;
};

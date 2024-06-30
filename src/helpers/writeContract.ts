import { ethers } from "ethers";
import { toast } from "react-hot-toast";

interface WriteContractData {
  signer: ethers.Signer | any;
  address: string;
  abi: any[];
  method: string;
  args?: any[];
  val?: string;
  chainId?: number;
  switchNetworkAsync: (chainId: number) => Promise<void>;
  message?: string;
}

export const writeContract = async (
  data: WriteContractData
): Promise<string | ethers.ContractReceipt> => {
  const loadToast = toast.loading("Transaction processing...");

  try {
    const {
      signer,
      address,
      abi,
      method,
      args,
      val,
      chainId,
      switchNetworkAsync,
      message,
    } = data;

    if (!address || !abi || !method) {
      toast.error("address, abi or method not provided");
      toast.dismiss(loadToast);
      return "err";
    }

    if (signer == null) {
      toast.error("Please connect your wallet");
      toast.dismiss(loadToast);
      return "err";
    }
    let signerChainId = signer.provider?._network?.chainId;

    if (chainId !== undefined) {
      if (chainId !== signerChainId) {
        toast.error("Please switch to the correct network");
        toast.dismiss(loadToast);
        await switchNetworkAsync(chainId);
        return "err";
      }
    }

    const contract = new ethers.Contract(address, abi, signer);

    let val_: string | ethers.BigNumber | undefined = val;
    if (!val_) {
      val_ = ethers.utils.parseUnits("0", 0);
    }

    let args_: any[] | undefined = args;
    if (!args_) {
      args_ = [];
    }

    const tx = await contract[method](...args_, {
      value: val_,
    });

    const receipt = await tx.wait();
    toast.success(message ?? "Transaction successful");
    toast.dismiss(loadToast);

    return receipt;
  } catch (error) {
    console.error(error);
    toast.error(
      error
        ? error.reason !== undefined
          ? error.reason?.includes("execution reverted")
            ? error.reason?.split("execution reverted:")[1]
            : error.reason
          : error.message !== undefined
          ? error.message === "Internal JSON-RPC error."
            ? "Insufficient Balance"
            : error.message
          : "Something went wrong"
        : "Something went wrong"
    );
    toast.dismiss(loadToast);
    return "err";
  }
};

import { ethers } from "ethers";

interface ReadContractData {
  address: string;
  abi: any[];
  method: string;
  args?: any[];
  rpcList: string[];
}

export const readContract = async (data: ReadContractData): Promise<any> => {
  try {
    const { address, abi, method, args, rpcList } = data;

    if (!rpcList || rpcList?.length === 0) {
      throw new Error("rpcList not provided");
    }

    if (!address || !abi || !method) {
      throw new Error("address, abi or method not provided");
    }

    let args_ = args || [];

    let contract: ethers.Contract | null = null;

    const getContract = async (rpcUrl: string): Promise<ethers.Contract> => {
      try {
        const providerIn = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
        return new ethers.Contract(address, abi, providerIn);
      } catch (error) {
        console.error(error);
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 10_000)
        );
        throw error;
      }
    };

    const arr_: Promise<ethers.Contract>[] = rpcList.map((rpcUrl) =>
      getContract(rpcUrl)
    );

    try {
      contract = await Promise.race([
        ...arr_,
        new Promise<ethers.Contract>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 10_000)
        ),
      ]);
    } catch (error) {
      console.error(error);
    }

    const result_ = contract?.[method](...args_);

    return result_;
  } catch (error) {
    console.error(error, "all rpc error");
    throw new Error(error);
  }
};

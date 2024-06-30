import React, { useMemo, useState } from "react";
import { FaArrowsUpDown } from "react-icons/fa6";
import { Select } from "antd";
import { useAccount } from "wagmi";
import { useSigner } from "../../../../helpers/useSigner";
import { erc20Abi, tokenAddress, validatorAddress } from "../../../../contract";
import { writeContract } from "../../../../helpers/writeContract";
import EthLogo from "@/assets/images/eth.png";
import BscLogo from "@/assets/images/bsc.png";
import OgpuLogo from "@/assets/images/ogpu.png";
import BigNumber from "bignumber.js";
import toast from "react-hot-toast";

import "./index.css";

function Bridge({ infos }) {
  const { address, chainId } = useAccount();

  const signer = useSigner();

  const [fromChain, setFromChain] = useState("eth");
  const [toChain, setToChain] = useState("ogpu");

  const chainOptions = (key) => {
    return [
      {
        value: "bsc",
        label: (
          <div className="bridge-box-chain">
            <button>
              <img src={BscLogo} alt="bsc" />
            </button>
            <div className="bridge-box-chain-names">
              <span>{key} Chain</span>
              <span>BSC (Testnet)</span>
            </div>
          </div>
        ),
      },
      {
        value: "eth",
        label: (
          <div className="bridge-box-chain">
            <button>
              <img src={EthLogo} alt="eth" />
            </button>
            <div className="bridge-box-chain-names">
              <span>{key} Chain</span>
              <span>Ethereum (Sepolia)</span>
            </div>
          </div>
        ),
      },
      {
        value: "ogpu",
        label: (
          <div className="bridge-box-chain">
            <button>
              <img src={OgpuLogo} alt="ogpu" />
            </button>
            <div className="bridge-box-chain-names">
              <span>{key} Chain</span>
              <span>OpenGPU (Devnet)</span>
            </div>
          </div>
        ),
      },
    ];
  };

  let nameToId = {
    bsc: 97,
    eth: 11155111,
    ogpu: 201720082023,
  };

  const activeInfo = useMemo(() => {
    return infos[nameToId[fromChain]];
  }, [infos, fromChain]);

  const [amount, setAmount] = useState(null);

  const handleSetAmount = (percent) => {
    if (!address) {
      setAmount(0);
      return;
    }
    let value = activeInfo.balance * percent;

    setAmount(value);
  };

  const amountControl = () => {
    if (
      amount == 0 ||
      amount == null ||
      amount == undefined ||
      amount == "" ||
      Number(amount) < 0 ||
      isNaN(amount)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const [loading, setLoading] = useState(false);
  const handleTransfer = async () => {
    if (!address || !signer) {
      toast.error("Please connect your wallet");
      return;
    }

    if (fromChain === toChain) {
      toast.error("Please select different chains");
      return;
    }

    if (amountControl()) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (chainId != nameToId[fromChain]) {
      toast.error("Please switch to the chain you want to transfer from");
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      let amount2 = new BigNumber(amount).multipliedBy(
        new BigNumber(10).pow(18)
      );

      let context = {
        signer: signer,
        address: tokenAddress[nameToId[fromChain]],
        abi: erc20Abi,
        method: "transferWithChainId",
        args: [validatorAddress, amount2.toString(10), nameToId[toChain]],
        message: "Transfer Success",
      };

      await writeContract(context);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bridge-component">
      <Select
        className="bridge-box-select"
        defaultValue="eth"
        onChange={(e) => setFromChain(e)}
        options={chainOptions("From")}
      />

      <div className="divider">
        <FaArrowsUpDown />
      </div>

      <Select
        className="bridge-box-select"
        defaultValue="ogpu"
        onChange={(e) => setToChain(e)}
        options={chainOptions("To")}
      />

      <div className="bridge-box-amount">
        <img src="/logo.png" alt="logo" />

        <input
          type="text"
          placeholder="$BRX amount to bridge"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="bridge-box-balances">
        <button onClick={() => handleSetAmount(0.25)}>25%</button>
        <button onClick={() => handleSetAmount(0.5)}>50%</button>
        <button onClick={() => handleSetAmount(0.75)}>75%</button>
        <button onClick={() => handleSetAmount(1)}>MAX</button>
      </div>
      <button
        className="bridge-box-button"
        disabled={loading}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
        onClick={() => handleTransfer()}
      >
        Transfer
      </button>
    </div>
  );
}

export default Bridge;

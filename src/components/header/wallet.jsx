import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import "./index.css";

function Wallet() {
  const { open } = useWeb3Modal();
  let { address, isConnected, chain } = useAccount();

  let walletAddress = address?.slice(0, 6) + "..." + address?.slice(-4);

  let wrongNetwork = isConnected && !chain;

  if (!isConnected) {
    return (
      <button className="connect-btn" onClick={() => open()}>
        Connect Wallet
      </button>
    );
  } else if (wrongNetwork) {
    return (
      <button
        className="connect-btn wrong-network"
        onClick={() => open({ view: "Networks" })}
      >
        Wrong Network
      </button>
    );
  } else {
    return (
      <button className="connect-btn" onClick={() => open()}>
        {walletAddress}
      </button>
    );
  }
}

export default Wallet;

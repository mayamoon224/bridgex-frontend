import React, { useEffect, useState } from "react";
import { FaMoneyCheckDollar, FaPlus } from "react-icons/fa6";
import BscLogo from "@/assets/images/bsc.png";
import EthLogo from "@/assets/images/eth.png";
import OgpuLogo from "@/assets/images/ogpu.png";
import BridgeBox from "./components/bridge";
import { useAccount } from "wagmi";
import { erc20Abi, tokenAddress } from "../../contract";
import { readContract } from "../../helpers/readContract";
import { rpcList } from "../../helpers/rpcList";
import { useSigner } from "../../helpers/useSigner";
import BigNumber from "bignumber.js";
import toast from "react-hot-toast";
import { writeContract } from "../../helpers/writeContract";
import axios from "axios";
import History from "./components/history";
import "./index.css";
import { Tooltip } from "antd";

function Bridge() {
  const { address, chainId } = useAccount();

  let items = [
    {
      chain: "OpenGPU",
      chainName: "Devnet",
      chainId: 201720082023,
      tokenAddress: tokenAddress["201720082023"],
      logo: OgpuLogo,
    },

    {
      chain: "Ethereum",
      chainName: "Sepolia",
      chainId: 11155111,
      tokenAddress: tokenAddress["11155111"],
      logo: EthLogo,
    },
    {
      chain: "BSC",
      chainName: "Testnet",
      chainId: 97,
      tokenAddress: tokenAddress["97"],
      logo: BscLogo,
    },
  ];

  const [infos, setInfos] = useState({
    97: {
      balance: 0,
    },
    11155111: {
      balance: 0,
    },
    201720082023: {
      balance: 0,
    },
  });

  const getDatas = async () => {
    if (!address) {
      setInfos({
        97: {
          balance: 0,
        },
        11155111: {
          balance: 0,
        },
        201720082023: {
          balance: 0,
        },
      });
      return;
    }
    try {
      let contextBscBalance = {
        address: tokenAddress["97"],
        abi: erc20Abi,
        method: "balanceOf",
        args: [address],
        rpcList: rpcList["97"],
      };

      let contextEthBalance = {
        address: tokenAddress["11155111"],
        abi: erc20Abi,
        method: "balanceOf",
        args: [address],
        rpcList: rpcList["11155111"],
      };

      let contextOgpuBalance = {
        address: tokenAddress["201720082023"],
        abi: erc20Abi,
        method: "balanceOf",
        args: [address],
        rpcList: rpcList["201720082023"],
      };

      let promises = [
        readContract(contextBscBalance),
        readContract(contextEthBalance),
        readContract(contextOgpuBalance),
      ];

      let [bscBalance, ethBalance, ogpuBalance] = await Promise.all(promises);

      setInfos({
        97: {
          balance: new BigNumber(bscBalance?.toString(10))
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber(),
        },
        11155111: {
          balance: new BigNumber(ethBalance?.toString(10))
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber(),
        },
        201720082023: {
          balance: new BigNumber(ogpuBalance?.toString(10))
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber(),
        },
      });
    } catch (e) {
      console.error(e);
      setInfos({
        97: {
          balance: 0,
        },
        11155111: {
          balance: 0,
        },
        201720082023: {
          balance: 0,
        },
      });
    }
  };

  useEffect(() => {
    getDatas();

    let interval = setInterval(() => {
      getDatas();
    }, 5_000);

    return () => {
      clearInterval(interval);
    };
  }, [address]);

  const signer = useSigner();

  const [loading, setLoading] = useState(false);
  const handleMint = async (itemChainId) => {
    if (loading) return;

    if (!address || !signer) {
      toast.error("Please connect your wallet");
      return;
    }

    if (itemChainId !== chainId) {
      toast.error("Please switch to the chain you want to mint on");
      return;
    }

    setLoading(true);
    try {
      let amount = new BigNumber(1_000).multipliedBy(new BigNumber(10).pow(18));
      let context = {
        signer: signer,
        address: tokenAddress[itemChainId],
        abi: erc20Abi,
        method: "mint",
        args: [address, amount?.toString(10)],
        message: "Minting Success",
      };

      await writeContract(context);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const [historyData, setHistory] = useState(null);

  const getHistory = async () => {
    if (!address) {
      setHistory([]);
      return;
    }
    try {
      let res = await axios.get(
        "https://bridgex-backend.vercel.app/api/history/" + address
      );

      if (res?.status == 200) {
        setHistory(res?.data?.data);
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error(e);
      setHistory([]);
    }
  };

  useEffect(() => {
    getHistory();

    let interval = setInterval(() => {
      getHistory();
    }, 5_000);

    return () => {
      clearInterval(interval);
    };
  }, [address]);

  return (
    <div className="bridge">
      <div className="bridge-title">
        <span>Welcome to BridgeX</span>
        <span>
          Easily bridge tokens across multiple blockchains for enhanced asset
          flexibility and interoperability.
        </span>
      </div>
      <div className="bridge-wrapper">
        <div className="bridge-top">
          <div className="bridge-box">
            <BridgeBox infos={infos} />
          </div>
          <div className="bridge-box">
            <div className="portfolio-title">
              <FaMoneyCheckDollar />
              <span>Portfolio</span>
            </div>
            <div className="portfolio-table">
              <table>
                <thead>
                  <tr>
                    <th>Chain</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="portfolio-chain">
                          <img src={item.logo} alt="chain-logo" />
                          <div className="portfolio-chain-name">
                            <span>{item?.chain}</span>
                            <span>{item?.chainName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {parseFloat(
                          infos[item.chainId]?.balance
                        )?.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        BRX
                      </td>
                      <td>
                        <div className="portfolio-action">
                          <Tooltip title="Mint 1,000 BRX" placement="bottom">
                            <button
                              className="portfolio-mint"
                              onClick={() => handleMint(item?.chainId)}
                              disabled={loading}
                              style={{
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                              }}
                            >
                              <FaPlus />
                              <span>Mint</span>
                            </button>
                          </Tooltip>
                          {/* <Tooltip title="Add to Metamask" placement="bottom">
                          <button className="portfolio-metamask">
                            <img
                              src={Metamask}
                              alt="metamask"
                              draggable="false"
                            />
                          </button>
                        </Tooltip> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <History data={historyData} />
      </div>
    </div>
  );
}

export default Bridge;

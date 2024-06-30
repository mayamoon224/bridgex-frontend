import React from "react";
import BscLogo from "@/assets/images/bsc.png";
import EthLogo from "@/assets/images/eth.png";
import OgpuLogo from "@/assets/images/ogpu.png";
import moment from "moment";
import "./index.css";

function History({ data }) {
  const chainConverter = (chainId) => {
    if (chainId == 97) {
      return {
        name: "BSC",
        shortName: "Testnet",
        logo: BscLogo,
      };
    } else if (chainId == 11155111) {
      return {
        name: "Ethereum",
        shortName: "Sepolia",
        logo: EthLogo,
      };
    } else {
      return {
        name: "OpenGPU",
        shortName: "Devnet",
        logo: OgpuLogo,
      };
    }
  };

  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <div className="history">
      <div className="history-title">
        <span>Your Bridge Transactions</span>
        <span>
          Here you can view all your previous bridge transactions and their
          statuses. Please note that there might be slight delays in processing
          as transactions are confirmed on the blockchain.
        </span>
      </div>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>From Chain</th>
              <th>To Chain</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.map((item, index) => (
                <tr key={item?._id}>
                  <td>
                    <div className="history-table-chain">
                      <img
                        src={chainConverter(item?.fromChain)?.logo}
                        alt={chainConverter(item?.fromChain)?.name}
                      />
                      <div className="history-table-chain-names">
                        <span>{chainConverter(item?.fromChain)?.name}</span>
                        <span>
                          {chainConverter(item?.fromChain)?.shortName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="history-table-chain">
                      <img
                        src={chainConverter(item?.toChain)?.logo}
                        alt={chainConverter(item?.toChain)?.name}
                      />
                      <div className="history-table-chain-names">
                        <span>{chainConverter(item?.toChain)?.name}</span>
                        <span>{chainConverter(item?.toChain)?.shortName}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {parseFloat(item?.amount).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    BRX
                  </td>
                  <td>{moment(item?.timestamp).format("MMMM DD, HH:mm A")}</td>
                  <td>
                    <div className="table-status">
                      <span>{item?.status}</span>
                      <span
                        style={{
                          backgroundColor:
                            item?.status === "completed"
                              ? "#1dd91d"
                              : item?.status === "pending"
                              ? "#e5966b"
                              : item?.status === "failed"
                              ? "#f22f2f"
                              : "#e5966b",
                        }}
                      ></span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="history-note">
        <p
          style={{
            color: "white",
          }}
        >
          Note: Transactions may experience slight delays as they are confirmed
          on the blockchain.
        </p>
      </div>
    </div>
  );
}

export default History;

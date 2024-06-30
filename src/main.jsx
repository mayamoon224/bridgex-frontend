import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Web3ModalProvider } from "./helpers/connection";
import { ConfigProvider, theme } from "antd";

import Layout from "@/layout";

import * as buffer from "buffer";

import "@/assets/css/index.css";
import "@/assets/css/reset.css";

window.Buffer = buffer.Buffer;

ReactDOM.createRoot(document.getElementById("root")).render(
  <Web3ModalProvider>
    <Toaster />
    <ConfigProvider>
      <Layout />
    </ConfigProvider>
  </Web3ModalProvider>
);

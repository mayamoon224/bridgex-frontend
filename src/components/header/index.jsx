import Wallet from "./wallet";
import "./index.css";

function Header() {
  return (
    <div className="header">
      <div className="header-wrapper">
        <div className="header-logo">
          <img src="/logo.png" alt="logo" draggable="false" />
          <span>BridgeX</span>
        </div>
        <Wallet />
      </div>
    </div>
  );
}

export default Header;

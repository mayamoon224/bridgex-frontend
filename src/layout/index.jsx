import Header from "@/components/header";
import Bridge from "../components/bridge";
import "./index.css";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="outlet">
        <Bridge />
      </div>
    </div>
  );
}

export default Layout;

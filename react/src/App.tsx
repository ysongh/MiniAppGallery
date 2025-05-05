import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

import { ConnectMenu } from "./components/ConnectMenu";
import MiniAppList from "./pages/MiniAppList";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <div className="bg-blue-400">Mini App Gallery</div>
      <ConnectMenu />
      <MiniAppList />
    </>
  );
}

export default App;

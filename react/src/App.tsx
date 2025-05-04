import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

import { ConnectMenu } from "./components/ConnectMenu";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <div className="bg-blue-400">Mini App Gallery</div>
      <ConnectMenu />
    </>
  );
}

export default App;

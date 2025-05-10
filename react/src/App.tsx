import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ConnectMenu } from "./components/ConnectMenu";
import MiniAppList from "./pages/MiniAppList";
import SubmitAppPage from "./pages/SubmitAppPage";
import AppDetail from "./pages/AppDetail";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <HashRouter>
      <ConnectMenu />
      <Routes>
        <Route
          path="/app/:id"
          element={<AppDetail />} />
        <Route
          path="/submitapp"
          element={<SubmitAppPage />} />
        <Route
          path="/"
          element={<MiniAppList />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

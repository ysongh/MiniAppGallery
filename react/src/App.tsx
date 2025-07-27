import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ConnectMenu } from "./components/ConnectMenu";
import MiniAppList from "./pages/MiniAppList";
import SubmitApp from "./pages/SubmitApp";
import AppDetail from "./pages/AppDetail";
import UserProfile from "./pages/UserProfile";
import EditApp from "./pages/EditApp";
import SelfVerification from "./pages/SelfVerification";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <HashRouter>
      <ConnectMenu />
      <Routes>
        <Route
          path="/app/:id/:networkid"
          element={<AppDetail />} />
        <Route
          path="/editapp/:id/:networkid"
          element={<EditApp />} />
        <Route
          path="/profile"
          element={<UserProfile />} />
        <Route
          path="/submitapp"
          element={<SubmitApp />} />
        <Route
          path="/selfverification"
          element={<SelfVerification />} />
        <Route
          path="/"
          element={<MiniAppList />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

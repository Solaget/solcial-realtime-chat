import { useContext, useEffect, useLayoutEffect, useState } from "react";
// Css/Style 👇🏼
import "@/index.css";
import "@/components/ui/style/Style.css";
// Lib 👇🏼
import Cookie from "js-cookie";
// Lib Hooks 👇🏼
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// Initial Page router 👇🏼
import Routes from "@/routes/routes.jsx";
// Api 👇🏼
import { useLazyFetchCurrentAccountQuery } from "@/api/services/account.service.js";
// Components 👇🏼
import { Toaster } from "@/components/ui/toaster";
// Initail socket.io 👇🏼
import useSocketEvents from "./socket/hooks/useSocketEvents";
import setupSocket from "./socket";
// Store for current socket
export let socket;
const App = () => {
  const [isSocketConnected, setSocketIsConnected] = useState(false);
  const token = Cookie.get("token");
  const [fetchAccount] = useLazyFetchCurrentAccountQuery();

  useLayoutEffect(() => {
    if (token) {
      fetchAccount();
      socket = setupSocket(token, setSocketIsConnected);
      return;
    }
  }, [token]);

  // All Socket Events 👇🏼
  useSocketEvents(socket, isSocketConnected);

  return (
    <div id="app" className="bg-background">
      <Routes />
      <Toaster />
    </div>
  );
};

export default App;

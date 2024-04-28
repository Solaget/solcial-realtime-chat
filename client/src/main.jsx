import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const rootElement = document.getElementById("root");
// Router
import { BrowserRouter } from "react-router-dom";
// Redux
import { Provider } from "react-redux";
import store from "@/redux/store";
// Context Provider
import { ThemeProvider } from "@/context/theme-provider";
import ChatContextProvider from "@/context/chat-provider";
import PageLoader from "./components/common/page-loader";

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <Suspense fallback={<PageLoader/>}>
      <BrowserRouter>
        <ThemeProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  </Provider>
);


import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import RouterWrapper from "router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeWrapper } from "theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const container = document.getElementById("root")!;
const root = createRoot(container);
const queryClient = new QueryClient();
root.render(
  <Provider store={store}>
    <ThemeWrapper>
      <QueryClientProvider client={queryClient}>
        <RouterWrapper />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeWrapper>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from "react-toastify";
import { router } from "./router";
// import Confirmation from "./shared-component/Confirmation";
const Confirmation = React.lazy(() => import("@/shared-component/Confirmation").then((module) => ({default: module.default})));

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
     <ToastContainer limit={1} />
      <Confirmation />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
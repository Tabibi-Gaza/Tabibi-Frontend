import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContextProvider.jsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faQuestion,
  faCheck,
  faArrowLeft,
  faStethoscope,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faQuestion, faCheck, faArrowLeft, faStethoscope, faChevronDown);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppContextProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </AppContextProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);

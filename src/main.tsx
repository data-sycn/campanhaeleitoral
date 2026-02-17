import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initOfflineSync } from "@/lib/offlineSync";

initOfflineSync();

createRoot(document.getElementById("root")!).render(<App />);

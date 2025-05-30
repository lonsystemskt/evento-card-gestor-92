
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ArchivedEvents from "./pages/ArchivedEvents";
import CompletedDemands from "./pages/CompletedDemands";
import GeneralView from "./pages/GeneralView";
import CRM from "./pages/CRM";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/geral" element={<GeneralView />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/anotacoes" element={<Notes />} />
          <Route path="/eventos-arquivados" element={<ArchivedEvents />} />
          <Route path="/demandas-concluidas" element={<CompletedDemands />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

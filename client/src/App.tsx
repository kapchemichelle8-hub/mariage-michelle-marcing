import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import DeclinedPage from "./pages/DeclinedPage";
import Home from "./pages/Home";
import SimulationPage from "./pages/SimulationPage";
import TicketPage from "./pages/TicketPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/billet/:code" component={TicketPage} />
      <Route path="/indisponible" component={DeclinedPage} />
      <Route path="/simulation" component={SimulationPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/404" component={NotFound} />
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

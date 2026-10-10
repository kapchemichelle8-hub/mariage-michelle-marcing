import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import BadgeAccueilPage from "./pages/BadgeAccueilPage";
import DeclinedPage from "./pages/DeclinedPage";
import Home from "./pages/Home";
import ReceptionPage from "./pages/ReceptionPage";
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
      <Route path="/accueil" component={ReceptionPage} />
      <Route path="/badge-accueil" component={BadgeAccueilPage} />
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

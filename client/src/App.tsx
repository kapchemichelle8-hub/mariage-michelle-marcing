import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";

// Les pages secondaires sont chargées à la demande pour alléger l'invitation.
const TicketPage = lazy(() => import("./pages/TicketPage"));
const AbsencePage = lazy(() => import("./pages/AbsencePage"));
const JourJPage = lazy(() => import("./pages/JourJPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-ivory" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/billet/:code" component={TicketPage} />
        <Route path="/merci" component={AbsencePage} />
        <Route path="/jour-j" component={JourJPage} />
        <Route path="/espace-maries" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

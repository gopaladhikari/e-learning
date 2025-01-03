import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_unprotected")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

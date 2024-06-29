import { FC } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const RootComponent: FC = () => {
  const isDevelopment = import.meta.env.MODE === "development";

  return (
    <div style={{ width: "80vw" }}>
      <Outlet />
      {isDevelopment && <TanStackRouterDevtools />}
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

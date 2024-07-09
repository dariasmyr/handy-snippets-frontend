import { FC, useEffect, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ConfigProvider, theme } from "antd";

const RootComponent: FC = () => {
  const isDevelopment = import.meta.env.MODE === "development";
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (event: MediaQueryListEvent): void => {
      setIsDarkTheme(event.matches);
    };
    mediaQuery.addEventListener("change", handleThemeChange);
    return (): void =>
      mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ width: "80vw" }}>
        <Outlet />
        {isDevelopment && <TanStackRouterDevtools />}
      </div>
    </ConfigProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Tabs } from "antd";

import logo from "../../.github/logo.svg";
import logoDark from "../../.github/logo-dark.svg";
import styles from "../routes/__root.module.scss";

export interface ITabProperties {
  tabOpened: string;
}

const items = [
  {
    key: "1",
    label: "General",
  },
  {
    key: "2",
    label: "Format",
    disabled: true,
  },
  {
    key: "3",
    label: "Help",
  },
];

export const Header = (properties: ITabProperties): ReactElement => {
  const navigate = useNavigate();
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

  const handleTabChange = (key: string): void => {
    if (key === "3") {
      navigate({ to: "/help" });
    } else if (key === "1") {
      navigate({ to: "/" });
    }
  };

  const logoImage = isDarkTheme ? logoDark : logo;

  return (
    <div>
      <Tabs
        tabBarExtraContent={{
          left: (
            <img
              src={logoImage}
              alt="logo"
              className={styles.logo}
              onClick={(): void => {
                window.location.href = "/";
              }}
            />
          ),
        }}
        activeKey={properties.tabOpened}
        items={items}
        onChange={handleTabChange}
      />
    </div>
  );
};

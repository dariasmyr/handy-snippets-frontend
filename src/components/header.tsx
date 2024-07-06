import { ReactElement } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Tabs } from "antd";

import logo from "../../.github/logo.svg";
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

  const handleTabChange = (key: string): void => {
    if (key === "3") {
      navigate({ to: "/help" });
    } else if (key === "1") {
      navigate({ to: "/" });
    }
  };

  return (
    <div>
      <Tabs
        tabBarExtraContent={{
          left: (
            <img
              src={logo}
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

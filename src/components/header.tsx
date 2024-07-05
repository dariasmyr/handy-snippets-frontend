import { ReactElement } from "react";
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
      />
    </div>
  );
};

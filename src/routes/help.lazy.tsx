import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, Flex, Result } from "antd";

import { Header } from "../components/header.tsx";

export const Route = createLazyFileRoute("/help")({
  component: Help,
});
const handleGoToSupport = (): void => {
  window.open("https://t.me/daria_smyr", "_blank");
};

function Help(): JSX.Element {
  return (
    <Flex vertical>
      <Header tabOpened={"3"} />
      <Result
        status="404"
        title="Help is on the way!"
        subTitle="If you need help, please contact the developer."
        extra={
          <Button type="primary" onClick={handleGoToSupport}>
            Go to support
          </Button>
        }
      />
    </Flex>
  );
}

export default Help;

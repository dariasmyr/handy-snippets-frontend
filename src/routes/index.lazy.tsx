import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Segmented,
  Space,
  Tabs,
  Typography,
} from "antd";

import logo from "../../.github/logo.svg";

import styles from "./__root.module.scss";

const { Title } = Typography;
const { TextArea } = Input;

const confirm: PopconfirmProps["onConfirm"] = (event): void => {
  console.log(event);
  message.success("Click on Yes");
};

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
  message.error("Click on No");
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  const [activeTab, setActiveTab] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const urlParameters = new URLSearchParams(window.location.search);
  const documentId = urlParameters.get("documentId");
  const accessKey = urlParameters.get("accessKey");
  const urlPassword = urlParameters.get("password");

  useEffect(() => {
    if (documentId && accessKey) {
      setActiveTab("2");
    } else if (documentId && !urlPassword) {
      showModal();
    } else if (documentId && urlPassword) {
      setActiveTab("2");
    } else {
      setActiveTab("1");
    }
  }, [documentId, accessKey, urlPassword]);

  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOk = (): void => {
    if (password) {
      setIsModalOpen(false);
      setActiveTab("2");
    } else {
      message.error("Please enter the password.");
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: "1",
      label: "Create Document",
    },
    {
      key: "2",
      label: "View/Edit Document",
    },
  ];

  const renderContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "1": {
        return (
          <Flex gap="small" vertical>
            <Flex justify={"space-between"}>
              <Flex gap="small" wrap>
                <Button type="primary">Create new</Button>
                <Button>Save</Button>
              </Flex>
              <Flex gap="small" wrap>
                <Segmented
                  options={["Copy to clipboard", "Raw"]}
                  onChange={(value) => {
                    console.log(value);
                  }}
                />
                <Space>
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Send"
                    cancelText="Cancel"
                  >
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </Flex>
            </Flex>
            <Input placeholder="Name of the document" variant="filled" />
            <TextArea rows={20} />
          </Flex>
        );
      }
      case "2": {
        return (
          <Flex gap="small" vertical>
            <Title level={3}>Title of the document</Title>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
              dui quis mi tincidunt ultricies. Curabitur ac metus in nunc
              tincidunt aliquam. Sed nec nulla nec odio ultricies tincidunt. Ut
              nec libero sit amet odio malesuada ultricies. Nulla facilisi.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia Curae; Nullam nec ultrices odio. Nulla facilisi.
              Nullam nec ultrices odio. Nulla facilisi. Nullam nec ultrices
              odio. Nulla facilisi. Nullam nec ultrices odio. Nulla facilisi.
              Nullam nec ultrices odio. Nulla facilisi.
            </p>
          </Flex>
        );
      }
      default: {
        return <Title level={1}>Ant Design</Title>;
      }
    }
  };

  return (
    <Flex gap="middle" vertical>
      <div>
        <Tabs
          className={styles.tabs}
          tabBarExtraContent={{
            left: <img src={logo} alt="logo" className={styles.logo} />,
          }}
          defaultActiveKey="1"
          items={items}
          onChange={setActiveTab}
        />
      </div>
      <Modal
        title="Enter Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Enter your password to continue.</p>
        <Input
          placeholder="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Modal>
      {renderContent()}
    </Flex>
  );
}

export default Index;

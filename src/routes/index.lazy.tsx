import { useState } from "react";
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
} from "antd";
import { Typography } from "antd";

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
  // const { loading, data, error } = useGetAllFilmsQuery();
  const [activeTab, setActiveTab] = useState("1");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOk = (): void => {
    setIsModalOpen(false);
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const onChange = (key: string): void => {
    if (key === "2") {
      showModal();
      setActiveTab(key);
    } else {
      setActiveTab(key);
    }
  };

  const items = [
    {
      key: "1",
      label: "Tab 1",
    },
    {
      key: "2",
      label: "Tab 2",
    },
  ];

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  // if (!data) return <p>No data!</p>;

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
                <Segmented<string>
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
              Nullam nec ultrices odio. Nulla facilisi. Nullam nec ultrices
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
          onChange={onChange}
        />
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Enter your password to continue.</p>
        <Input placeholder="Password" variant="filled" type="password" />
      </Modal>
      {renderContent()}
    </Flex>
  );
}

export default Index;

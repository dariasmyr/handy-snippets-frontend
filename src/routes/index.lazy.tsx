// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-null */
import { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Space,
} from "antd";

import { Header } from "../components/header.tsx";
import { useCreateDocumentMutation } from "../generated/graphql.tsx";

const { TextArea } = Input;

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
};

const createAccessKey = (): string => {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
};

const toBase64 = (password: string): string => {
  return btoa(password);
};

function Index(): JSX.Element {
  const [createDocument] = useCreateDocumentMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<string | null>(null);
  const navigate = useNavigate({ from: "/" });
  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleGeneratePassword = (): void => {
    setPassword(toBase64(Math.random().toString(36).slice(-8)));
  };

  const handleOk = async (): Promise<void> => {
    if (password === null) {
      message.error("Password cannot be empty");
    } else {
      setIsModalOpen(false);
      try {
        const accessKeyGenerated = createAccessKey();
        // TODO: Encrypt document data
        const { data: createDocumentData } = await createDocument({
          variables: {
            title: documentTitle || "Untitled",
            value: documentData || "",
            accessKey: accessKeyGenerated,
          },
        });
        if (createDocumentData?.createDocument) {
          message.success("Document created successfully");
          await navigate({
            to: "/view",
            search: {
              id: createDocumentData.createDocument,
              accessKey: accessKeyGenerated,
              password: toBase64(password),
              fromCreate: true,
            },
          });
        }
      } catch (error) {
        message.error(`Failed to create document: ${error}`);
      }
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const handleCreateNewDocument = (): void => {
    setDocumentTitle(null);
    setDocumentData(null);
  };

  const handleSaveDocument = (): void => {
    if (documentData === null) {
      message.error("Document data cannot be empty");
    } else {
      showModal();
    }
  };

  const renderCreateButton = (): JSX.Element => {
    return documentData === null ? (
      <Button type="primary" onClick={handleCreateNewDocument}>
        Create new
      </Button>
    ) : (
      <Flex gap="small" wrap>
        <Popconfirm
          title="Are you sure to create a new document?"
          onConfirm={handleCreateNewDocument}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Create new</Button>
        </Popconfirm>
      </Flex>
    );
  };

  const Controls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Space>{renderCreateButton()}</Space>
          <Button onClick={handleSaveDocument}>Save</Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex gap="middle" vertical>
      <Header tabOpened={"1"} />
      <Flex gap="small" vertical>
        <Controls />
        <Input
          placeholder="Name me!"
          variant="filled"
          value={documentTitle || ""}
          onChange={(event) => setDocumentTitle(event.target.value)}
        />
        <TextArea
          rows={20}
          placeholder="Time to write something awesome!"
          variant="filled"
          value={documentData || ""}
          onChange={(event) => setDocumentData(event.target.value)}
        />
      </Flex>
      <Modal
        title="Enter Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Enter your password to encrypt the document.</p>
        <Flex justify="start" gap={"small"}>
          <Button type="dashed" onClick={handleGeneratePassword}>
            Generate
          </Button>
          <Input.Password
            placeholder="Password"
            variant="filled"
            type="password"
            value={password!}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(event) => setPassword(event.target.value)}
          />
        </Flex>
      </Modal>
    </Flex>
  );
}

export default Index;

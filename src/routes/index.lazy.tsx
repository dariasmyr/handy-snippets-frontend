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
import { runes } from "runes2";

import { useCryptoCore } from "../common/use-crypto-core.ts";
import { Header } from "../components/header.tsx";
import { useCreateDocumentMutation } from "../generated/graphql.tsx";

const { TextArea } = Input;

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
};

const encodeBase64 = (data: string): string => {
  return btoa(data);
};

function Index(): JSX.Element {
  const [createDocument] = useCreateDocumentMutation();
  const cryptoCore = useCryptoCore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(
    cryptoCore.generatePassword(32),
  );
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<string | null>(null);

  const navigate = useNavigate({ from: "/" });
  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleGeneratePassword = (): void => {
    const PASSWORD_LENGTH = 32;
    setPassword(cryptoCore.generatePassword(PASSWORD_LENGTH));
  };

  const handleOk = async (): Promise<void> => {
    if (password) {
      setIsModalOpen(false);
      try {
        const accessKeyGenerated = cryptoCore.generateKey();
        const key = cryptoCore.generateKey();
        const encryptedKey = cryptoCore.encryptKey(key, password);

        const encryptedData = cryptoCore.encrypt(
          { title: documentTitle, value: documentData },
          key,
        );

        const { data: createDocumentData } = await createDocument({
          variables: {
            value: encryptedData,
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
              encryptedKey,
              password: encodeBase64(password),
              fromCreate: true,
            },
          });
        }
      } catch (error) {
        message.error(`Failed to create document: ${error}`);
      }
    } else {
      message.error("Password cannot be empty");
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const handleCreateNewDocument = (): void => {
    setDocumentTitle(null);
    setDocumentData(null);
  };

  const handleSaveDocument = async (): Promise<void> => {
    if (documentData === null) {
      await message.error("Document data cannot be empty");
    } else {
      showModal();
    }
  };

  const renderCreateButton = (): JSX.Element => {
    return documentData === null || documentData === "" ? (
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

  const renderSaveButton = (): JSX.Element | null => {
    return documentData === null || documentData === "" ? null : (
      <Button onClick={handleSaveDocument}>Save</Button>
    );
  };

  const Controls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Space>{renderCreateButton()}</Space>
          {renderSaveButton()}
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
          maxLength={500}
        />
        <TextArea
          rows={20}
          placeholder="Time to write something awesome!"
          variant="filled"
          value={documentData || ""}
          onChange={(event) => setDocumentData(event.target.value)}
          count={{
            show: true,
            max: 100_000,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
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

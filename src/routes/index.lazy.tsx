// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-null */
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
  Space,
  Tabs,
  Typography,
} from "antd";

import logo from "../../.github/logo.svg";
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentQuery,
} from "../generated/graphql.tsx";

import styles from "./__root.module.scss";

const { Title } = Typography;
const { TextArea } = Input;

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
  message.error("Click on No");
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const createAccessKey = (): string => {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
};

const encryptDocument = (document: string, password: string): string => {
  return CryptoJS.AES.encrypt(document, password).toString();
};

const decryptDocument = (document: string, password: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(document, password);
    if (bytes.toString()) {
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

function Index(): JSX.Element {
  const [createDocument] = useCreateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [activeTab, setActiveTab] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [accessKey, setAccessKey] = useState<string | null>("");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentData, setDocumentData] = useState<string>("");

  const urlParameters = new URLSearchParams(window.location.search);
  const documentIdFromUrl = urlParameters.get("documentId");
  const accessKeyFromUrl = urlParameters.get("accessKey");
  const urlPassword = urlParameters.get("password");

  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(documentIdFromUrl || "0") },
    skip: !documentIdFromUrl,
  });

  useEffect(() => {
    if (documentIdFromUrl) {
      setActiveTab("2");
      setDocumentId(Number.parseInt(documentIdFromUrl));
      if (getDocumentData?.getDocument?.value) {
        setDocumentData(getDocumentData.getDocument?.value);
      }
      if (!urlPassword) {
        showModal();
      }
      if (accessKeyFromUrl) {
        setAccessKey(accessKeyFromUrl);
      }
    } else {
      setActiveTab("1");
    }
  }, [documentIdFromUrl, accessKeyFromUrl, urlPassword]);

  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOk = async (): Promise<void> => {
    if (password) {
      setIsModalOpen(false);
      if (activeTab === "1") {
        try {
          const accessKeyGenerated = createAccessKey();
          const { data: createDocumentData } = await createDocument({
            variables: {
              title: documentTitle,
              value: encryptDocument(documentData, password),
              accessKey: accessKeyGenerated,
            },
          });
          if (createDocumentData?.createDocument) {
            setDocumentId(createDocumentData.createDocument);
            setAccessKey(accessKeyGenerated);
            message.success("Document created successfully");
          }
        } catch (error) {
          message.error(`Failed to create document: ${error}`);
        }
      } else if (activeTab === "2") {
        // decrypt the document
        // if password is correct, update the document
        // else show error message
        message.success("Password accepted.");
        decryptDocument(documentData, password);
      }
    } else {
      message.error("Please enter the password.");
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const handleCreateNewDocument = (): void => {
    setDocumentTitle("");
    setDocumentData("");
  };

  const handleCreateDocument = (): void => {
    showModal();
  };

  const handleCopyToClipboard = (): void => {
    const url = `${window.location.origin}/?documentId=${documentId}&accessKey=${accessKey}&password=${password}`;
    message.success("Copied to clipboard, share the link with others.");
    navigator.clipboard.writeText(url);
  };

  const handleDeleteDocument = async (): Promise<void> => {
    if (!documentId || !accessKey) {
      message.error("Document ID or access key missing.");
      return;
    }
    try {
      await deleteDocument({
        variables: { id: documentId, accessKey },
      });
      message.success("Document deleted successfully");
      setDocumentId(null);
      setAccessKey(null);
      setActiveTab("1");
    } catch (error) {
      message.error(`Failed to delete document: ${error}`);
    }
  };

  const items = [
    {
      key: "1",
      label: "Create Document",
    },
    {
      key: "2",
      label: "View/Edit Document",
      disabled: !documentIdFromUrl,
    },
  ];

  const Controls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={handleCreateNewDocument}>
            Create new
          </Button>
          <Button onClick={handleCreateDocument}>Save</Button>
        </Flex>
        <Flex gap="small" wrap>
          <Button
            type={"dashed"}
            onClick={handleCopyToClipboard}
            disabled={!documentId}
          >
            Copy to clipboard
          </Button>
          <Button type={"dashed"} onClick={handleCreateDocument}>
            Raw
          </Button>
          <Space>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              disabled={!documentId}
              onConfirm={handleDeleteDocument}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </Flex>
      </Flex>
    );
  };

  const renderContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "1": {
        return (
          <Flex gap="small" vertical>
            <Controls />
            <Input
              placeholder="Name of the document"
              variant="filled"
              value={documentTitle}
              onChange={(event) => setDocumentTitle(event.target.value)}
            />
            <TextArea
              rows={20}
              placeholder="Document content"
              variant="filled"
              value={documentData}
              onChange={(event) => setDocumentData(event.target.value)}
            />
          </Flex>
        );
      }
      case "2": {
        if (getDocumentLoading) return <p>Loading...</p>;
        if (getDocumentError) return <p>Error: {getDocumentError.message}</p>;
        return accessKeyFromUrl ? (
          <Flex gap="small" vertical>
            <Controls />
            <Input
              placeholder={
                getDocumentData?.getDocument?.title || "Untitled document"
              }
              variant="filled"
              value={documentTitle}
              onChange={(event) => setDocumentTitle(event.target.value)}
            />
            <TextArea
              rows={20}
              placeholder={
                getDocumentData?.getDocument?.value || "Document content"
              }
              variant="filled"
              value={documentData}
              onChange={(event) => setDocumentData(event.target.value)}
            />
          </Flex>
        ) : (
          <Flex gap="small" vertical>
            <Title level={3}>
              {getDocumentData?.getDocument?.title || "Title of the document"}
            </Title>
            <p>{documentData}</p>
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

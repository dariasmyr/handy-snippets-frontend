import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Space,
  Typography,
} from "antd";

import { Header } from "../components/header.tsx";
import {
  useDeleteDocumentMutation,
  useGetDocumentQuery,
} from "../generated/graphql.tsx";

const { Title } = Typography;
const { TextArea } = Input;

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
  message.error("Click on No");
};

export const Route = createLazyFileRoute("/view")({
  component: View,
});

function View(): JSX.Element {
  const documentIdFromUrl = new URLSearchParams(window.location.search).get(
    "documentId",
  );
  const accessKeyFromUrl = new URLSearchParams(window.location.search).get(
    "accessKey",
  );
  const passwordFromUrl = new URLSearchParams(window.location.search).get(
    "password",
  );

  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(documentIdFromUrl!) },
    skip: !documentIdFromUrl,
  });

  const [deleteDocument] = useDeleteDocumentMutation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(!passwordFromUrl);
  const [password, setPassword] = useState(passwordFromUrl || "");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentData, setDocumentData] = useState<string>("");

  useEffect(() => {
    if (getDocumentData?.getDocument) {
      setDocumentTitle(getDocumentData.getDocument.title || "Untitled");
      setDocumentData(getDocumentData.getDocument.value);
    }
  }, [getDocumentData]);

  if (!documentIdFromUrl) {
    window.location.href = "/";
  }

  if (getDocumentLoading) {
    return <div>Loading...</div>;
  }

  if (getDocumentError) {
    return <div>Error: {getDocumentError.message}</div>;
  }

  const handleCopyToClipboard = (): void => {
    navigator.clipboard.writeText(documentData);
    message.success("Copied to clipboard.");
  };

  const handleGeneratingPublicLink = (): void => {
    const url = `${window.location.origin}/view?documentId=${documentIdFromUrl}&accessKey=${accessKeyFromUrl}&password=${password}`;
    message.success("Copied to clipboard, share the link with others.");
    navigator.clipboard.writeText(url);
    setIsShareModalOpen(false);
  };

  const handleGeneratingPrivateLink = (): void => {
    const url = `${window.location.origin}/view?documentId=${documentIdFromUrl}&accessKey=${accessKeyFromUrl}`;
    message.success("Copied to clipboard, share the link with others.");
    navigator.clipboard.writeText(url);
    setIsShareModalOpen(false);
  };

  const handleShowDocument = async (): Promise<void> => {
    if (password) {
      setIsPasswordModalOpen(false);
    } else {
      message.error("Password is required to view the document.");
    }
  };

  const handleGoToCreatePage = async (): Promise<void> => {
    window.location.href = "/";
  };

  const handleCancel = (): void => {
    setIsPasswordModalOpen(false);
    setIsShareModalOpen(false);
  };

  const handleDeleteDocument = async (): Promise<void> => {
    if (!documentIdFromUrl || !accessKeyFromUrl) {
      message.error("Document ID or access key missing.");
      return;
    }
    try {
      await deleteDocument({
        variables: {
          id: Number(documentIdFromUrl),
          accessKey: accessKeyFromUrl,
        },
      });
      message.success("Document deleted successfully");
      window.location.href = "/";
    } catch (error) {
      message.error(`Failed to delete document: ${error}`);
    }
  };

  const handleDecryptDocument = (): string => {
    if (password) {
      return password + documentData;
    } else {
      message.error("Failed to decrypt document, password is missing");
      return documentData;
    }
  };

  const renderContent = (): JSX.Element => {
    return accessKeyFromUrl ? (
      <Flex gap="small" vertical>
        <Controls />
        <Flex gap="small" vertical>
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
            value={handleDecryptDocument()}
            onChange={(event) => setDocumentData(event.target.value)}
          />
        </Flex>
      </Flex>
    ) : (
      <Flex gap="small" vertical>
        <Title level={3}>{documentTitle}</Title>
        <p>{handleDecryptDocument()}</p>
      </Flex>
    );
  };

  const Controls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={handleGoToCreatePage}>
            Create new
          </Button>
        </Flex>
        <Flex gap="small" wrap>
          <Button type={"dashed"} onClick={handleCopyToClipboard}>
            Copy to clipboard
          </Button>
          <Button
            type={"default"}
            onClick={(): void => {
              setIsShareModalOpen(true);
            }}
          >
            Share
          </Button>
          <Space>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
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

  return (
    <Flex gap="middle" vertical>
      <Header tabOpened={"1"} />
      {!isPasswordModalOpen && renderContent()}
      <Modal
        title="Enter Password"
        open={isPasswordModalOpen}
        onOk={handleShowDocument}
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
      <Modal
        title="Share Document"
        open={isShareModalOpen}
        onCancel={handleCancel}
      >
        <p>Choose the access level for the document.</p>
        <Checkbox onChange={handleGeneratingPublicLink}>Public</Checkbox>
        <Checkbox onChange={handleGeneratingPrivateLink}>Private</Checkbox>
      </Modal>
    </Flex>
  );
}

export default View;

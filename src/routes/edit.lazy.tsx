import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Switch,
  Typography,
} from "antd";

import { Header } from "../components/header.tsx";
import {
  useDeleteDocumentMutation,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
} from "../generated/graphql.tsx";

import styles from "./__root.module.scss";

const { Title, Text, Paragraph } = Typography;

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
};

type EditParameters = {
  documentId: string;
  accessKey: string;
  password?: string | undefined;
};

export const Route = createFileRoute("/edit")({
  component: Edit,
  validateSearch: (parameters: EditParameters): EditParameters => {
    if (!parameters.documentId && !parameters.accessKey) {
      throw new Error("Document ID or access key is missing");
    }
    return parameters;
  },
});

function Edit(): JSX.Element {
  const [updateDocument] = useUpdateDocumentMutation();
  const [sendPasswordSeparately, setSendPasswordSeparately] =
    useState<boolean>(false);
  const parameters = Route.useSearch();
  const [link, setLink] = useState<string>(
    `${window.location.origin}/view?documentId=${parameters.documentId}&accessKey=${parameters.accessKey}${
      parameters.password ? `&password=${parameters.password}` : ""
    }`,
  );
  const documentIdFromUrl = parameters.documentId;
  const accessKeyFromUrl = parameters.accessKey;
  const passwordFromUrl = parameters.password;
  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(documentIdFromUrl!) },
    skip: !documentIdFromUrl,
  });

  const [deleteDocument] = useDeleteDocumentMutation();
  const [isAccesKeyAdded, setIsAccessKetAdded] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(!passwordFromUrl);
  const [password, setPassword] = useState(passwordFromUrl || "");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentData, setDocumentData] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (getDocumentData?.getDocument) {
      setDocumentTitle(getDocumentData.getDocument.title || "Untitled");
      setDocumentData(getDocumentData.getDocument.value);
    }
  }, [getDocumentData]);

  if (!documentIdFromUrl) {
    navigate({ to: "/" });
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

  const handleCopyLink = (): void => {
    message.success("Copied to clipboard, share the link with others.");
    navigator.clipboard.writeText(link);
    setIsShareModalOpen(false);
  };

  const handleToggleAccessKeyParameter = (): void => {
    if (isAccesKeyAdded === true) {
      const newLink = link.replace(/&accessKey=[^&]*/, "");
      setLink(newLink);
      setIsAccessKetAdded(false);
    } else {
      const newLink = `${link}&accessKey=${accessKeyFromUrl}`;
      setLink(newLink);
      setIsAccessKetAdded(true);
    }
  };

  const handleRemovePasswordFromLink = (): void => {
    const newLink = link.replace(/&password=[^&]*/, "");
    setLink(newLink);
    message.success("Password removed from link.");
  };

  const handleUpdateDocument = async (): Promise<void> => {
    const { data: updateDocumentData } = await updateDocument({
      variables: {
        id: getDocumentData!.getDocument!.id,
        title: documentTitle,
        value: documentData,
        accessKey: accessKeyFromUrl,
        ttlMs: getDocumentData!.getDocument!.ttlMs,
        maxViewCount: getDocumentData!.getDocument!.maxViewCount,
      },
    });
    if (updateDocumentData?.updateDocument) {
      message.success("Document updated successfully");
    }
  };

  const handleShowDocument = async (): Promise<void> => {
    if (password) {
      setIsPasswordModalOpen(false);
    } else {
      message.error("Password is required to view the document.");
    }
  };

  const handleGoToCreatePage = async (): Promise<void> => {
    navigate({ to: "/" });
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
      navigate({ to: "/" });
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
    return (
      <Flex gap="small" vertical>
        <EditControls />
        <Flex gap="small" vertical>
          <Title
            editable={{
              onChange: setDocumentTitle,
            }}
            level={3}
            style={{ margin: 0 }}
          >
            {documentTitle}
          </Title>
          <div className={styles.border}>
            <Paragraph
              editable={{
                triggerType: ["text", "icon"],
                onChange: setDocumentData,
                maxLength: 100_000,
                autoSize: { maxRows: 20, minRows: 3 },
              }}
            >
              {handleDecryptDocument()}
            </Paragraph>
          </div>
        </Flex>
      </Flex>
    );
  };

  const EditControls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={handleGoToCreatePage}>
            Create new
          </Button>
          <Button onClick={handleUpdateDocument} hidden={!documentData}>
            Save
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
            hidden={!accessKeyFromUrl || !password}
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
      </Modal>
      <Modal
        title="Share Document"
        open={isShareModalOpen}
        onCancel={handleCancel}
      >
        <Flex gap={"middle"} vertical>
          <Flex gap={"middle"} vertical>
            <Title level={3}>Choose the access level for the document.</Title>
            <Flex gap={"small"}>
              <Switch
                checked={sendPasswordSeparately}
                onChange={(checked) => {
                  setSendPasswordSeparately(checked);
                  if (checked) {
                    handleRemovePasswordFromLink();
                  } else {
                    setLink(`${link}&password=${password}`);
                  }
                }}
              />
              <Text>Send password separately</Text>
            </Flex>
            <Flex gap={"small"}>
              <Text>{link}</Text>
              <Button type={"primary"} onClick={handleCopyLink}>
                Copy link
              </Button>
            </Flex>
          </Flex>
          <Flex gap={"small"} vertical>
            <Checkbox onChange={handleToggleAccessKeyParameter}>
              Add access key so that others could edit the document
            </Checkbox>
            <Flex
              gap={"small"}
              justify={"flex-end"}
              align={"center"}
              hidden={sendPasswordSeparately}
            >
              <Text>{password}</Text>
              <Button
                type={"primary"}
                onClick={() => navigator.clipboard.writeText(password)}
              >
                Copy password
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default Edit;

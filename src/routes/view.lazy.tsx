import { useEffect, useState } from "react";
import {
  CopyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Space,
  Tooltip,
  Typography,
} from "antd";

import { Header } from "../components/header.tsx";
import { ShareModal } from "../components/share.tsx";
import { useGetDocumentQuery } from "../generated/graphql.tsx";

import styles from "./__root.module.scss";

const { Title, Text } = Typography;

type ViewParameters = {
  id: string;
  accessKey: string;
  password?: string | undefined;
  fromCreate?: boolean | undefined;
};

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
};

const toBase64 = (password: string): string => {
  return btoa(password);
};

export const Route = createFileRoute("/view")({
  component: View,
  validateSearch: (parameters: ViewParameters): ViewParameters => {
    if (!parameters.id) {
      throw new Error("Document ID is missing");
    }
    return parameters;
  },
});

function View(): JSX.Element {
  const parameters = Route.useSearch();
  const idFromUrl: string = parameters.id;
  const accessKeyFromUrl: string | undefined = parameters.accessKey;
  const passwordFromUrl: string | undefined = parameters.password;
  const fromCreate = parameters.fromCreate;
  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(idFromUrl!) },
    skip: !idFromUrl,
  });

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

  useEffect(() => {
    if (fromCreate === true) {
      setIsShareModalOpen(true);
    }
  }, [fromCreate]);

  if (!idFromUrl) {
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

  const handleGoToEditPage = async (): Promise<void> => {
    await navigate({
      to: "/edit",
      search: {
        id: getDocumentData!.getDocument!.id,
        accessKey: accessKeyFromUrl,
        password: toBase64(password),
      },
    });
  };

  const handleCancel = (): void => {
    setIsPasswordModalOpen(false);
    setIsShareModalOpen(false);
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
      <Flex gap="middle" vertical>
        <ViewControls />
        <Flex gap="small" vertical>
          <Title level={3} style={{ margin: 0 }}>
            {documentTitle}
          </Title>
          <div className={styles.border}>
            <Text>{handleDecryptDocument()}</Text>
          </div>
        </Flex>
      </Flex>
    ) : (
      <Flex gap="small" vertical>
        <ViewControls />
        <Title level={3}>{documentTitle}</Title>
        <div className={styles.border}>
          <Text>{handleDecryptDocument()}</Text>
        </div>
      </Flex>
    );
  };

  const ViewControls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Popconfirm
            title="Create new document?"
            description="You will lose unsaved changes. Do you want to create a new document?"
            onConfirm={handleGoToCreatePage}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Create new</Button>
          </Popconfirm>
          {accessKeyFromUrl && (
            <Button onClick={handleGoToEditPage}>Edit</Button>
          )}
        </Flex>
        <Flex gap="small" wrap>
          <Space.Compact block>
            <Tooltip title="Copy to clipboard">
              <Button icon={<CopyOutlined />} onClick={handleCopyToClipboard} />
            </Tooltip>
            <Button
              type={"default"}
              onClick={(): void => {
                setIsShareModalOpen(true);
              }}
              hidden={!accessKeyFromUrl || !password}
            >
              Share
            </Button>
          </Space.Compact>
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
        <p>Enter your password to decrypt the document.</p>
        <Flex justify="start" gap={"small"}>
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
      <ShareModal
        id={idFromUrl}
        password={password}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        accessKey={accessKeyFromUrl}
      />
    </Flex>
  );
}

export default View;

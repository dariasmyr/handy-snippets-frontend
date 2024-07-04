import { useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  message,
  Modal,
  Switch,
  Typography,
} from "antd";

import { Header } from "../components/header.tsx";
import { useGetDocumentQuery } from "../generated/graphql.tsx";

import styles from "./__root.module.scss";

const { Title, Text } = Typography;

type ViewParameters = {
  documentId: string;
  accessKey: string;
  password?: string | undefined;
  fromCreate?: boolean | undefined;
};

export const Route = createFileRoute("/view")({
  component: View,
  validateSearch: (parameters: ViewParameters): ViewParameters => {
    if (!parameters.documentId) {
      throw new Error("Document ID is missing");
    }
    return parameters;
  },
});

function View(): JSX.Element {
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
  const fromCreate = parameters.fromCreate;
  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(documentIdFromUrl!) },
    skip: !documentIdFromUrl,
  });

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

  useEffect(() => {
    if (fromCreate === true) {
      setIsShareModalOpen(true);
    }
  }, [fromCreate]);

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
        documentId: getDocumentData!.getDocument!.id.toString(),
        accessKey: accessKeyFromUrl,
        password: password,
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
      <Flex gap="small" vertical>
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
          <Button type="primary" onClick={handleGoToCreatePage}>
            Create new
          </Button>
          <Button onClick={handleGoToEditPage} hidden={!accessKeyFromUrl}>
            Edit
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

export default View;

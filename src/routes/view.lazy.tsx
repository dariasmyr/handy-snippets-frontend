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
  Space,
  Tooltip,
  Typography,
} from "antd";

import { useCryptoCore } from "../common/use-crypto-core.ts";
import { Header } from "../components/header.tsx";
import { ShareModal } from "../components/share.tsx";
import { useGetDocumentQuery } from "../generated/graphql.tsx";

import styles from "./__root.module.scss";

const { Title, Text } = Typography;

type ViewParameters = {
  id: string;
  accessKey: string;
  encryptedKey: string;
  password?: string | undefined;
  fromCreate?: boolean | undefined;
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

const encodeBase64 = (data: string): string => {
  return Buffer.from(data).toString("base64");
};
const decodeBase64 = (data: string): string => {
  return Buffer.from(data, "base64").toString("ascii");
};

function View(): JSX.Element {
  const parameters = Route.useSearch();
  const idFromUrl: string = parameters.id;
  const accessKeyFromUrl: string | undefined = parameters.accessKey;
  const encryptedKeyFromUrl: string = parameters.encryptedKey;
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

  const [backgroundColor, setBackgroundColor] = useState("#333");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(!passwordFromUrl);
  const [password, setPassword] = useState(passwordFromUrl || "");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentData, setDocumentData] = useState<string>("");
  const navigate = useNavigate();
  const cryptoCore = useCryptoCore();

  useEffect(() => {
    if (!passwordFromUrl) {
      return;
    }
    if (getDocumentData?.getDocument?.value) {
      const decryptedKey = cryptoCore.decryptKey(
        encryptedKeyFromUrl,
        decodeBase64(passwordFromUrl),
      );

      const decryptedData = cryptoCore.decrypt(
        getDocumentData.getDocument.value,
        decryptedKey,
      );

      setDocumentTitle(decryptedData.title);
      setDocumentData(decryptedData.value);
    }
  }, [getDocumentData, encryptedKeyFromUrl, passwordFromUrl, cryptoCore]);

  useEffect(() => {
    if (fromCreate === true) {
      setIsShareModalOpen(true);
    }
  }, [fromCreate]);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const handleDarkModeChange = (event: MediaQueryListEvent): void => {
      setBackgroundColor(event.matches ? "#333" : "#fafafa");
    };

    setBackgroundColor(darkModeMediaQuery.matches ? "#333" : "#fafafa");
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return (): void => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

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

      if (getDocumentData?.getDocument?.value) {
        const decryptedKey = cryptoCore.decryptKey(
          decodeBase64(encryptedKeyFromUrl),
          password,
        );

        const decryptedData = cryptoCore.decrypt(
          getDocumentData.getDocument.value,
          decryptedKey,
        );

        setDocumentTitle(decryptedData.title);
        setDocumentData(decryptedData.value);
      }
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
        encryptedKey: encryptedKeyFromUrl,
        password: encodeBase64(password),
      },
    });
  };

  const handleCancel = (): void => {
    setIsPasswordModalOpen(false);
    setIsShareModalOpen(false);
  };

  const renderContent = (): JSX.Element => {
    return accessKeyFromUrl ? (
      <Flex gap="middle" vertical>
        <ViewControls />
        <Flex gap="small" vertical>
          <Title level={3} style={{ margin: 0 }}>
            {documentTitle}
          </Title>
          <div className={styles.border} style={{ backgroundColor }}>
            <Text>
              {documentData.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </Text>
          </div>
        </Flex>
      </Flex>
    ) : (
      <Flex gap="small" vertical>
        <ViewControls />
        <Title level={3}>{documentTitle}</Title>
        <div className={styles.border} style={{ backgroundColor }}>
          <Text>
            {documentData.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Text>
        </div>
      </Flex>
    );
  };

  const ViewControls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button onClick={handleGoToCreatePage} type="primary">
            Create new
          </Button>
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
        encryptedKey={encryptedKeyFromUrl}
      />
    </Flex>
  );
}

export default View;

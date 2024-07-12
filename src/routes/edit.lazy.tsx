// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-null */
import { useEffect, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
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
} from "antd";

import { useCryptoCore } from "../common/use-crypto-core.ts";
import { Header } from "../components/header.tsx";
import { ShareModal } from "../components/share.tsx";
import {
  useDeleteDocumentMutation,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
} from "../generated/graphql.tsx";

const { TextArea } = Input;

const cancel: PopconfirmProps["onCancel"] = (event): void => {
  console.log(event);
};

type EditParameters = {
  id: string;
  accessKey: string;
  encryptedKey: string;
  password?: string | undefined;
};

export const Route = createFileRoute("/edit")({
  component: Edit,
  validateSearch: (parameters: EditParameters): EditParameters => {
    if (!parameters.id && !parameters.accessKey) {
      throw new Error("Document ID or access key is missing");
    }
    return parameters;
  },
});

const encodeBase64 = (data: string): string => {
  return btoa(data);
};
const decodeBase64 = (data: string): string => {
  return atob(data);
};

function Edit(): JSX.Element {
  const [updateDocument] = useUpdateDocumentMutation();
  const parameters = Route.useSearch();
  const idFromUrl: string = parameters.id;
  const accessKeyFromUrl: string | undefined = parameters.accessKey;
  const encryptedKeyFromUrl: string = parameters.encryptedKey;
  const passwordFromUrl: string | undefined = parameters.password;
  const {
    data: getDocumentData,
    loading: getDocumentLoading,
    error: getDocumentError,
  } = useGetDocumentQuery({
    variables: { id: Number.parseInt(idFromUrl!) },
    skip: !idFromUrl,
  });
  const cryptoCore = useCryptoCore();

  const [deleteDocument] = useDeleteDocumentMutation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(!passwordFromUrl);
  const [password, setPassword] = useState(passwordFromUrl || "");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentData, setDocumentData] = useState<string>("");
  const navigate = useNavigate();

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
  }, [getDocumentData, encryptedKeyFromUrl, passwordFromUrl]);

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

  const handleUpdateDocument = async (): Promise<void> => {
    try {
      const decryptedKey = cryptoCore.decryptKey(
        encryptedKeyFromUrl,
        decodeBase64(password),
      );
      const encryptedData = cryptoCore.encrypt(
        { title: documentTitle, value: documentData },
        decryptedKey,
      );
      const { data: updateDocumentData } = await updateDocument({
        variables: {
          id: getDocumentData!.getDocument!.id,
          value: encryptedData,
          accessKey: accessKeyFromUrl,
          ttlMs: getDocumentData!.getDocument!.ttlMs,
          maxViewCount: getDocumentData!.getDocument!.maxViewCount,
        },
      });
      if (updateDocumentData?.updateDocument) {
        message.success("Document updated successfully");
        await navigate({
          to: "/view",
          search: {
            id: getDocumentData!.getDocument!.id,
            accessKey: accessKeyFromUrl,
            encryptedKey: encryptedKeyFromUrl,
            password: encodeBase64(password),
          },
        });
      }
    } catch (error) {
      message.error(`Failed to update document: ${error}`);
    }
  };

  const handleShowDocument = async (): Promise<void> => {
    if (password) {
      setIsPasswordModalOpen(false);

      if (getDocumentData?.getDocument?.value) {
        const decryptedKey = cryptoCore.decryptKey(
          encryptedKeyFromUrl,
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

  const handleCancel = (): void => {
    setIsPasswordModalOpen(false);
    setIsShareModalOpen(false);
  };

  const handleDeleteDocument = async (): Promise<void> => {
    if (!idFromUrl || !accessKeyFromUrl) {
      message.error("Document ID or access key missing.");
      return;
    }
    try {
      await deleteDocument({
        variables: {
          id: Number(idFromUrl),
          accessKey: accessKeyFromUrl,
        },
      });
      message.success("Document deleted successfully");
      navigate({ to: "/" });
    } catch (error) {
      message.error(`Failed to delete document: ${error}`);
    }
  };

  const renderContent = (): JSX.Element => {
    return (
      <Flex gap="small" vertical>
        <EditControls />
        <Flex gap="small" vertical>
          <Input
            placeholder="Name me!"
            variant="filled"
            value={documentTitle}
            onChange={(event) => setDocumentTitle(event.target.value)}
          />
          <TextArea
            rows={20}
            placeholder="Time to write something awesome!"
            variant="filled"
            value={documentData}
            onChange={(event) => setDocumentData(event.target.value)}
          />
        </Flex>
      </Flex>
    );
  };

  const renderSaveButton = (): JSX.Element | null => {
    return documentData === null || documentData === "" ? null : (
      <Button onClick={handleUpdateDocument}>Save</Button>
    );
  };

  const EditControls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button onClick={handleGoToCreatePage} type="primary">
            Create new
          </Button>
          {renderSaveButton()}
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
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        accessKey={accessKeyFromUrl}
        encryptedKey={encryptedKeyFromUrl}
      />
    </Flex>
  );
}

export default Edit;

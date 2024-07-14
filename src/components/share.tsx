import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Space,
  Switch,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export interface IShareProperties {
  id: string;
  password?: string;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  accessKey?: string;
  encryptedKey: string;
}
const decodeBase64 = (data: string): string => {
  return atob(data);
};

export const ShareModal = ({
  id,
  password,
  isShareModalOpen,
  setIsShareModalOpen,
  accessKey,
  encryptedKey,
}: IShareProperties): JSX.Element => {
  const [isAccessKeyAdded, setIsAccessKeyAdded] = useState(false);
  const [sendPasswordSeparately, setSendPasswordSeparately] =
    useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    if (accessKey) {
      setIsAccessKeyAdded(true);
    }
  }, []);

  useEffect(() => {
    const generateLink = (): string => {
      let baseLink = `${window.location.origin}/view?id=${id}`;
      baseLink += `&encryptedKey=${encryptedKey}`;
      if (password && !sendPasswordSeparately) {
        baseLink += `&password=${password}`;
      }
      if (password && sendPasswordSeparately) {
        baseLink = baseLink.replace(`&password=${password}`, "");
      }
      if (accessKey && isAccessKeyAdded) {
        baseLink += `&accessKey=${accessKey}`;
      }
      return baseLink;
    };

    setLink(generateLink());
  }, [id, password, sendPasswordSeparately, accessKey, isAccessKeyAdded]);

  const handleCancel = (): void => {
    setIsShareModalOpen(false);
  };

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(link);
    message.success("Copied to clipboard, share the link with others.");
  };

  const handleTogglePasswordParameter = (checked: boolean): void => {
    setSendPasswordSeparately(checked);
    if (checked) {
      message.info("Password will be shown separately for copying.");
    }
  };

  const handleCopyPassword = (): void => {
    if (password) {
      navigator.clipboard.writeText(password);
      message.success("Password copied to clipboard.");
      handleCancel();
    }
  };

  return (
    <Modal
      open={isShareModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
    >
      <Flex vertical gap="middle">
        <Title level={3}>Choose access level</Title>
        <Flex gap="small">
          <Switch
            checked={sendPasswordSeparately}
            onChange={handleTogglePasswordParameter}
          />
          <Text>Send password separately</Text>
        </Flex>
        {accessKey && (
          <Flex gap="small">
            <Switch
              checked={isAccessKeyAdded}
              onChange={(checked) => setIsAccessKeyAdded(checked)}
            />
            <Text>Allow to edit</Text>
          </Flex>
        )}
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input size="small" value={link} readOnly />
            <Button type="primary" onClick={handleCopyLink}>
              Copy link
            </Button>
          </Space.Compact>
          {sendPasswordSeparately && password && (
            <Flex justify="flex-end" gap="small">
              <Space.Compact style={{ width: "70%" }}>
                <Input value={decodeBase64(password)} readOnly />
                <Button type="primary" onClick={handleCopyPassword}>
                  Copy password
                </Button>
              </Space.Compact>
            </Flex>
          )}
        </Space>
      </Flex>
    </Modal>
  );
};

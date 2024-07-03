// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-null */
import { useState } from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Input, message, Modal } from "antd";

import { Header } from "../components/header.tsx";
import { useCreateDocumentMutation } from "../generated/graphql.tsx";

const { TextArea } = Input;

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const createAccessKey = (): string => {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
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
              documentId: createDocumentData.createDocument.toString(),
              accessKey: accessKeyGenerated,
              password: password,
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
    setDocumentTitle("");
    setDocumentData("");
  };

  const handleSaveDocument = (): void => {
    if (documentData === null) {
      message.error("Document data cannot be empty");
    } else {
      showModal();
    }
  };

  const Controls = (): JSX.Element => {
    return (
      <Flex justify={"space-between"}>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={handleCreateNewDocument}>
            Create new
          </Button>
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
          placeholder="Name of the document"
          variant="filled"
          value={documentTitle || ""}
          onChange={(event) => setDocumentTitle(event.target.value)}
        />
        <TextArea
          rows={20}
          placeholder="Document content"
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
        <p>Enter your password to continue.</p>
        <Input
          placeholder="Password"
          variant="filled"
          type="password"
          value={password!}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Modal>
    </Flex>
  );
}

export default Index;

import { JSX } from "react";
import { useTranslation } from "react-i18next";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About(): JSX.Element {
  const { t } = useTranslation(["about"]);
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {t("about:text")}
    </div>
  );
}

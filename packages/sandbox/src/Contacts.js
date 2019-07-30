import React from "react";
import { useSuite } from "suite";
import { pageContainerStyle } from "./styles";

export function Contacts() {
  const { className } = useSuite();

  return <section @className={pageContainerStyle}>Contacts</section>;
}

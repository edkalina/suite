import React from "react";
import { css, useSuite } from "suite";

import { useNavigation } from "./react-router/useNavigation";

const headerCSS = css`
  display: flex;
  padding: 10px 16px;

  a {
    font-size: 2rem;
    margin-right: 1rem;
    color: #61dafb;
  }
`;

export function Header() {
  const { className } = useSuite();
  const { href } = useNavigation();

  return (
    <header @className={headerCSS}>
      <a @href="/">Home</a>
      <a @href="/page">Page</a>
      <a @href="/suite">Suite</a>
      <a @href="/unsuite">Unsuite</a>
      <a @href="/styled-system">StyledSystem</a>
    </header>
  );
}

import React from "react";
import { css, useSuite, keyframes } from "suite";
import logo from "./logo.svg";
import { pageContainerStyle } from "./styles";

const logoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;


const logoStyle = css`
  animation: ${logoSpin} infinite 20s linear;
  height: 40vmin;
  pointer-events: none;
`

const linkStyle = css`
  color: #61dafb;
`

export function Home() {
  const { className } = useSuite();

  return (
    <section @className={pageContainerStyle}>
      <img src={logo} @className={logoStyle} alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        @className={linkStyle}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </section>
  );
}

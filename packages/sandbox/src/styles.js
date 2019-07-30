import { createGlobalStyle, css } from "suite";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  button {
    border: 0 none;
    background: #61dafb none;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    border-radius: 4px;
    margin-top: 2rem;
  }
`;

export const pageContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
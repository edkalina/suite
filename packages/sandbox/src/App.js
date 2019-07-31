import React from "react";
import { css, useSuite, ThemeProvider } from "suite";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { GlobalStyle } from "./styles";

import { Header } from "./Header";
import { Home } from "./Home";
import { Page } from "./Page";
import { Suite } from "./Suite";
import { Unsuite } from "./Unsuite";
import { StyledSystem } from "./StyledSystem";

const appStyle = css`
  text-align: center;
  background-color: #282c34;
  min-height: 100vh;
  color: white;
  font-size: calc(10px + 2vmin);
`

const theme = {
  colors: {
    primary: 'palegreen'
  }
}

function App() {
  const { className } = useSuite();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <div @className={appStyle}>
          <Header />
          <Route exact path="/" component={Home} />
          <Route exact path="/page" component={Page} />
          <Route exact path="/suite" component={Suite} />
          <Route exact path="/unsuite" component={Unsuite} />
          <Route exact path="/styled-system" component={StyledSystem} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React from "react";
import { css, useSuite } from "suite";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { GlobalStyle } from "./styles";

import { Header } from "./Header";
import { Home } from "./Home";
import { Page } from "./Page";
import { About } from "./About";
import { Contacts } from "./Contacts";

const appStyle = css`
  text-align: center;
  background-color: #282c34;
  min-height: 100vh;
  color: white;
  font-size: calc(10px + 2vmin);
`

function App() {
  const { className } = useSuite();

  return (
    <Router>
      <GlobalStyle />
      <div @className={appStyle}>
        <Header />
        <Route exact path="/" component={Home} />
        <Route exact path="/page" component={Page} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contacts" component={Contacts} />
      </div>
    </Router>
  );
}

export default App;

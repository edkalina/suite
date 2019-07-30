import React, { useState } from "react";
import { useSuite, css, styled } from "suite";
import { pageContainerStyle } from "./styles";

const containerStyle = css`
  border: 1px solid ${p => p.active ? 'gold' : 'white'};
`;

const anotherStyle = css`
  width: 300px;
  height: 40px;
`;

const borderedStyle = css`
  border: 1px solid white;
`;

const goldifyStyle = css`
  ${anotherStyle.fragment}

  ${borderedStyle} {
    border-color: gold;
  }
`;

export function About() {
  const [counter, setCounter] = useState(0);
  const { className, classProps, style } = useSuite();

  return (
    <section @className={pageContainerStyle}>
      <div>About</div>
      <div>Counter: {counter}</div>
      <div>
        <button onClick={() => setCounter(c => c + 1)}>Click me</button>
      </div>
      <div
        @className={[containerStyle, anotherStyle]}
        @classProps={ {activeClassName: [containerStyle, anotherStyle], disabledClassName: anotherStyle} }
        activeClassName={"active"}
      />
      <div @style={css.fragment.withConfig({ id: 'XXX' })`width: 50px; height: 50px; border: 1px solid skyblue`} />
      <div @className={[containerStyle({ active: true }), anotherStyle]} className="outter"></div>
      <div @className={[containerStyle({ active: false }), anotherStyle]}></div>
      <div @className={[containerStyle({ active: true }), anotherStyle]}></div>
      <div>
        <div @className={[borderedStyle, anotherStyle]}></div>
      </div>
      <div @className={goldifyStyle}>
        <div @className={[borderedStyle, anotherStyle]}></div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { useUnsuite, css } from "suite";
import { pageContainerStyle } from "./styles";
import { space } from 'styled-system'

console.log(space({ mx: '15px'}));

const containerStyle = css`
  border: 1px solid ${p => p.active ? 'gold' : 'white'};
`;

const themedStyle = css`
  width: 75px;
  height: 75px;
  border: 1px solid ${p => p.theme.colors.primary};
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

export function Unsuite() {
  const [counter, setCounter] = useState(0);
  const s = useUnsuite({ componentId: 'Unsuite' });

  return (
    <section className={s(pageContainerStyle)}>
      <div>Unsuite</div>
      <div>Counter: {counter}</div>
      <div>
        <button onClick={() => setCounter(c => c + 1)}>Click me</button>
      </div>
      <div
        className={s(containerStyle, anotherStyle)}
        activeClassName={s(containerStyle, anotherStyle, "active")}
        disabledClassName={s(anotherStyle)}
      />
      <div className={s(css.fragment`width: 50px; height: 50px; border: 1px solid skyblue`, 'xxx')} />
      <div className={s(themedStyle)} />
      <div className={s(containerStyle({ active: true }), anotherStyle, 'outter')}></div>
      <div className={s(containerStyle({ active: false }), anotherStyle)}></div>
      <div className={s(containerStyle({ active: true }), anotherStyle)}></div>
      <div>
        <div className={s(borderedStyle, anotherStyle)}></div>
      </div>
      <div className={s(goldifyStyle)}>
        <div className={s(borderedStyle, anotherStyle)}></div>
      </div>
    </section>
  );
}

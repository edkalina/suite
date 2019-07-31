import React, { useState } from 'react';
import { useUnsuite, useStyledSystem } from 'suite';
import { pageContainerStyle } from './styles';
import { space, layout, border, color } from 'styled-system';

console.log(space({ mx: '15px' }));

function marginX(value) {
  return {
    marginLeft: value,
    marginRight: value,
  }
}

function SubComponent({ value }) {
  const ss = useStyledSystem({ componentId: 'SubComponent' });

  return (
    <div>
      <div
        className={ss(
          marginX('20px'),
          space({ mx: '15px' }),
          layout({ size: '40px' }),
          border({ borderX: '1px solid gold', borderY: '1px dashed skyblue' }),
          color({ backgroundColor: 'rgba(255,255,255,0.3)' })
        )}
      />
      <div
        className={ss(
          space({ mx: '15px' }),
          layout({ size: value }),
          border({ borderY: '1px solid gold', borderX: '1px dashed skyblue' }),
          color({ backgroundColor: 'rgba(255,255,255,0.3)' })
        )}
      />
      <div
        className={ss(
          space({ mx: '15px' }),
          layout({ size: '40px' }),
          border({ borderX: '1px solid gold', borderY: '1px dashed skyblue' }),
          color({ backgroundColor: 'rgba(255,255,255,0.3)' })
        )}
      />
    </div>
  );
}

export function StyledSystem() {
  const [counter, setCounter] = useState(0);
  const s = useUnsuite();
  const ss = useStyledSystem({ componentId: 'StyledSystem' });

  return (
    <section className={s(pageContainerStyle)}>
      <div>StyledSystem</div>
      <div>Counter: {counter}</div>
      <div>
        <button onClick={() => setCounter(c => c + 1)}>Click me</button>
      </div>
      <SubComponent value="20px" />
      <SubComponent value="30px" />
      <div
        className={ss(
          space({ mx: '15px' }),
          layout({ size: '40px' }),
          border({ borderX: '1px solid gold', borderY: '1px dashed skyblue' }),
          color({ backgroundColor: 'rgba(255,255,255,0.3)' })
        )}
      />
    </section>
  );
}

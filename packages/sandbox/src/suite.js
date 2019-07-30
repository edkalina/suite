import React from 'react';

const useSuite = () => {};

const css = {};
const breakpoints = {};
const system = {};

const { space, layout, color } = {};

const Header = css`
  font-size: 18px;
`;

const TextStyles = css.fragment.css`
  font: 18px;
`;

const Container = css`
  postion: relative;
  ${TextStyles};

  ${Header} {
    border: 1px solid black;
  }
`

const ExtendedContainer = css.extend(Container).css`
  font-size: 24px;
`


export function Component() {
  const { className, classProps, style } = useSuite();

  return (
    <div>
      {/* One className */}
      <div @className={Container} />
      {/* Array of classes */}
      <div @className={[ExtendedContainer, Header]} />
      {/* Parametrization */}
      <div @className={Container({ active: true })} />
      {/* additional classes */}
      <div
        @classProps={{
          active: Container, // => activeClassName
          disabled: Header, // => disabledClassName
          selected: css.fragment.css`background: gold`, // => selectedClassName
        }}
      />
      {/* inline-like styles */}
      <div
        @style={css.fragment.css`
          font-size: 18px;
        `}
      />
      {/* styled system */}
      <div
        @className={[
          space({ mx: [3, 4], p: 3}),
          layout({ size: ["20px", "30px"]}),
          color({ backgroundColor: 'gold', color: 'gray.0' })
        ]}
        mx={[3,4]}
      />
      {/* styled system */}
      <div
        @className={Container}
        @ss={[
          space({ mx: [3, 4], p: 3}),
          layout({ size: ["20px", "30px"]}),
          color({ backgroundColor: 'gold', color: 'gray.0' })
        ]}
      />
      {/* accessor plugins */}
      <div
        @style={css.fragment.css`
          color: ${system.color('red')};
          font-size: ${system.fontSize('normal')};

          ${breakpoints.down('sm')} {
            font-size: ${system.fontSize('normal')};
          }
        `}
      />
    </div>
  )
}

// TODO:
// + @className
// + array in @className
// + @classProps
// + parametrization
// + props composition
// - theme
// - params from props
// - class reference
// - inline css fragments
// - @style
// - macros
// - style-system
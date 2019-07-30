import React from "react";
import { useSuite } from "suite";
import { useNavigation } from "./react-router/useNavigation";
import { pageContainerStyle } from "./styles";

export function Page() {
  const { className } = useSuite();
  const { to } = useNavigation();

  return (
    <section @className={pageContainerStyle}>
      <div>Page</div>
      <button @to="/about" historyReplace>
        Go to About with history.replace
      </button>
    </section>
  );
}

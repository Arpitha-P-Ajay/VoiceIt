import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// TODO: Integrate Thirdweb provider when ready for gas-sponsorship
// import { ThirdwebProvider } from "@thirdweb-dev/react";
// import thirdwebClient, { aaOptions } from "./thirdwebClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ThirdwebProvider client={thirdwebClient} accountAbstraction={aaOptions}> */}
    <App />
    {/* </ThirdwebProvider> */}
  </React.StrictMode>,
);

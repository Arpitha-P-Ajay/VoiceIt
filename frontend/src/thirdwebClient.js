// thirdwebClient.js
// Creates and exports the Thirdweb client used by the React app.
import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const CLIENT_ID = process.env.REACT_APP_THIRDWEB_CLIENT_ID || null;

if (!CLIENT_ID) {
  console.warn("REACT_APP_THIRDWEB_CLIENT_ID is not set. Thirdweb features will be disabled.");
}

export const thirdwebClient = createThirdwebClient({
  clientId: CLIENT_ID,
});

export const aaOptions = {
  chain: sepolia,
  sponsorGas: true,
};

export default thirdwebClient;

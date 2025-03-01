import { createThirdwebClient } from "thirdweb";

const NEXT_PUBLIC_THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error("No THIRDWEB_CLIENT_ID param provided");
}
export const thirdwebClientSide = createThirdwebClient({
  clientId: NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

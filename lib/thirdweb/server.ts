import { createThirdwebClient } from "thirdweb";

const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

if (!THIRDWEB_SECRET_KEY) {
  throw new Error("No THIRDWEB_SECRET_KEY param provided");
}
export const thirdwebServerSide = createThirdwebClient({
  secretKey: THIRDWEB_SECRET_KEY,
});

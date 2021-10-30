import axios from "axios";
import { parseCookies } from "nookies";

import AccountHeader from "../components/Account/AccountHeader";
import AccountOrders from "../components/Account/AccountOrders";
import AccountPermissions from "../components/Account/AccountPermissions";
import baseUrl from "../utils/baseUrl";

function Account({ user, orders }) {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {user.role === "root" && <AccountPermissions />}
    </>
  );
}

Account.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) return { orders: [] };

  const config = { headers: { Authorization: token } };

  const url = `${baseUrl}/api/orders`;

  try {
    const res = await axios.get(url, config);
    return { orders: res.data };
  } catch (e) {
    console.error("Err while fetching orders", e);
    return {};
  }
};

export default Account;

import connectDb from "../../utils/connectDb";
import { apiHandler } from "../../utils/apiHandler";

connectDb();

export default apiHandler((req, res) => {
  return res.status(200).json(req.user);
});

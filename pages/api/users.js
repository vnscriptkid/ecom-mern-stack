import jwt from "jsonwebtoken";
import User from "../../models/User";
import { ApiError } from "../../utils/apiErrors";
import { apiHandler } from "../../utils/apiHandler";

export default apiHandler((req, res) => {
  switch (req.method) {
    case "GET":
      handleGetReq(req, res);
      break;
    case "PUT":
      handlePutReq(req, res);
      break;
    default:
      throw new ApiError(`Method is not allowed.`);
  }
});

async function handleGetReq(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } });
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Server error getting users`);
  }
}

async function handlePutReq(req, res) {
  const { _id, role } = req.body;

  if (!_id || !role)
    throw new ApiError(`Missing one or more fields in body request.`);

  try {
    await User.findOneAndUpdate({ _id }, { role });
    return res.status(200).send(`Role updated.`);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Server error while updating user role.`);
  }
}

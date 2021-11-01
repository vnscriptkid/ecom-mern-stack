import { ApiError } from "./apiErrors";

export { errorHandler };

function errorHandler(err, res) {
  if (err instanceof ApiError) {
    const { code, message } = err;

    return res.status(code).send(message);
  }

  // default to 500 server error
  return res
    .status(500)
    .json({ message: err.message || "Internal Server Error" });
}

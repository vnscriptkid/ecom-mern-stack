import { errorHandler } from "./errorHandler";
import { jwtMiddleware } from "./jwt-middleware";

export { apiHandler };

function apiHandler(handler) {
  return async (req, res) => {
    try {
      // global middleware
      await jwtMiddleware(req, res);

      // route handler
      await handler(req, res);
    } catch (err) {
      // global error handler
      console.error(err);
      return errorHandler(err, res);
    }
  };
}

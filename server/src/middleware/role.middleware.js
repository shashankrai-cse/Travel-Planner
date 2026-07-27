import { ApiError } from "../utils/apiError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required before role check"));
    }

    const userRole = req.user.role || "traveler";
    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`
        )
      );
    }

    next();
  };
};

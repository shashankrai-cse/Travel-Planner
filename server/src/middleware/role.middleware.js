import { ApiError } from "../utils/apiError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required before role check"));
    }

    const userRole = req.user.role || "traveler";

    // Normalize vendor and owner as equivalent roles
    const effectiveRoles = allowedRoles.flatMap((r) =>
      r === "vendor" || r === "owner" ? ["vendor", "owner"] : [r]
    );

    if (!effectiveRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role: [${allowedRoles.join(", ")}]. Current role: [${userRole}]`
        )
      );
    }

    next();
  };
};

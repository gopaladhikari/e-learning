import {
  verify,
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
  type JwtPayload,
} from "jsonwebtoken";
import { env } from "../config/env";
import { Customer } from "../models/customer/customer.model";
import { ApiError } from "../utils/apiResponse";
import { dbHandler } from "../utils/dbHandler";
import { Admin } from "../models/admin/admin.model";

interface DecodedUser extends JwtPayload {
  _id: string;
  email: string;
  fullName: string;
  role: "customer" | "admin";
}

export const verifyJwt = dbHandler(async (req, res, next) => {
  const incomingAccessToken = req.headers.authorization?.replace(
    "Bearer ",
    ""
  );

  if (!incomingAccessToken)
    throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = verify(
      incomingAccessToken,
      env.jwtSecret
    ) as DecodedUser;

    if (decoded.role === "customer") {
      const customer = await Customer.findById(decoded._id);

      if (!customer) throw new ApiError(404, "User not found");

      req.customer = customer;

      return next();
    }

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded._id);

      if (!admin) throw new ApiError(404, "User not found");

      req.admin = admin;

      next();
    }
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw new ApiError(400, "Token has expired");

    if (error instanceof NotBeforeError)
      throw new ApiError(400, "Token not yet valid");

    if (error instanceof JsonWebTokenError)
      throw new ApiError(400, "Malformed token");

    throw new ApiError(400, "Internal Server Error");
  }
});
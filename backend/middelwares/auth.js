import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const decryptedTokenDetails = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decryptedTokenDetails.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

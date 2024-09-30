import User from "../models/User.js";

export default async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("role");
    if (user.role !== "admin") {
      throw new Error("Unauthorized admin");
    }
    req.userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

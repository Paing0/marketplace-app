import Notification from "../models/Notification.js";

export const pushNofification = async (req, res) => {
  const { message, title, owner_id, product_id, phone_number } = req.body;
  try {
    await Notification.create({
      title,
      message,
      owner_id,
      product_id,
      phone_number,
    });
    return res.status(201).json({
      isSuccess: true,
      message: "Notification is pushed.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notis = await Notification.find({ owner_id: req.userId }).sort({
      createdAt: -1,
    });
    if (!notis || notis.length === 0) {
      throw new Error("No notifications yet.");
    }
    return res.status(200).json({
      isSuccess: true,
      notis,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const noti = await Notification.findById(id);

    if (req.userId.toString() !== noti.owner_id.toString()) {
      throw new Error("Authorization Failed.");
    }

    if (!noti) {
      throw new Error("notifications not found.");
    }

    noti.isRead = true;
    noti.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Done.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const deleteNoti = async (req, res) => {
  const { id } = req.params;
  try {
    const noti = await Notification.findById(id);

    if (req.userId.toString() !== noti.owner_id.toString()) {
      throw new Error("Authorization Failed.");
    }

    await Notification.findByIdAndRemove(id);

    return res.status(200).json({
      isSuccess: true,
      message: "Notification is deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const deleteAllNoti = async (req, res) => {
  try {
    await Notification.deleteMany({ owner_id: req.userId });

    return res.status(200).json({
      isSuccess: true,
      message: "Notification are cleared.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

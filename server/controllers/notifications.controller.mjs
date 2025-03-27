import Notification from "../models/Notification";

/**
 * Adds a notification to user's inbox.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns - Response object with status code and message.
 */
async function addNotification(req, res, next){
  try{

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notification = new Notification({
      message: req.body.message,
      user: req.body.userId,
      viewed: false
    });

    await notification.save();

    return res.status(200).json({message: 'Notification added'});
  } catch(err){
    err.status = 500;
    next(err);
  }
};

/**
 * This function retrieves all of user's notifications.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns - The response object
 */
async function getUserNotifications(req, res, next){
  try{

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({ user: req.body.userId });
    
    return res.status(200).json({notifications: notifications});
  } catch(err){
    err.status = 500;
    next(err);
  }
}

/**
 * Retrieves all the notification of user and marks them as read
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 */
async function readAllNotifications(req, res, next) {
  try {

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({ user: req.body.userId });

    const notificationsViewed = await Promise.all(
      notifications.map((notification) =>
        Notification.findOneAndUpdate(
          { _id: notification._id }, 
          { viewed: true },
          { returnDocument: 'after'}
        )
      )
    );

    res.json({ 
      message: "Notifications updated successfully", 
      notifications: notificationsViewed}); 

  } catch (err) {
    err.status = 500;
    next(err);
  }
};

/**
 * This function clears all of user's notifications.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns - The response object
 */
async function clearNotifications(req, res, next) {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Notification.deleteMany({ user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found for this user" });
    }

    res.json({ message: `Deleted ${result.deletedCount} notifications` });

  } catch (err) {
    err.status = 500;
    next(err);
  }
}

export {
  addNotification,
  getUserNotifications,
  readAllNotifications,
  clearNotifications
}


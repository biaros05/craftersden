import Notification from "../models/Notification";

async function addNotification(req, res, next){
  try{
    const notification = new Notification({
      message: req.body.message,
      user: req.body.userId,
      viewed: false
    });

    await notification.save();
  } catch(err){
    err.status = 500;
    next(err);
  }
};

async function getAllNotifications(req, res, next) {
  try {
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


import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
  id: String,
  message: String, 
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  viewed: Boolean
})

const Notification = model('Notification', NotificationSchema);

export default Notification;
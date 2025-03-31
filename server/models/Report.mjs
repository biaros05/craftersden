import { Schema, model } from 'mongoose';

const ReportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reason: String,
  createdAt: String
});

const Report = model('Report', ReportSchema, 'reports');

export default Report;



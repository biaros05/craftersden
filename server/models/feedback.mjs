import { Schema, model } from 'mongoose';

const FeedbackSchema = new Schema({
  type: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  message: String,
  createdAt: String
});

const Feedback = model('Feedback', FeedbackSchema, 'feedback');

export default Feedback;
import { Schema, model } from "mongoose";

const ReportSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reason: String,
  createdAt: String
});

const Report = model("Report", ReportSchema, 'reports');

export default Report;



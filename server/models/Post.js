import { Schema, model } from 'mongoose';

// Define a schema
const PostSchema = new Schema({
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  buildJSON: {},
  isPublished: Boolean,
  thumnails: [],
  progressPicture: String
});

// Compile model from schema, name of collection in the
//first parameter, Mongoose will pluralize
const Post = model('Post', PostSchema);

export default Post;
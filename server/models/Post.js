import { Schema, model } from 'mongoose';

const blockBuildSchema = new Schema({
  id: String,
  name: String,
  position: [Number, Number, Number],
  worldPosition: [Number, Number, Number],
  geometry: {},
  textureURLs: [String],
  rotation: [Number, Number, Number],
  rotationIndex: Number
});

// Define a schema
const PostSchema = new Schema({
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  buildJSON: [blockBuildSchema],
  isPublished: Boolean,
  thumnails: [],
  progressPicture: String,
  likedBy: [{ type: Schema.Types.ObjectId, ref:'User'}],
  savedBy: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  tags: []
});


// Compile model from schema, name of collection in the
//first parameter, Mongoose will pluralize
const Post = model('Post', PostSchema);

export default Post;
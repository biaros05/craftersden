import { Schema, model } from 'mongoose';

const blockBuildSchema = new Schema({
  pos: [Number, Number, Number],
  state: Number
});

const paletteSchema = new Schema({
  properties: {},
  name: {
    namespace: String,
    path: String
  },
});

// Define a schema
const PostSchema = new Schema({
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  buildJSON: {
    size: [Number, Number, Number],
    palette: [paletteSchema],
    placedBlocks: [blockBuildSchema]
  },
  isPublished: Boolean,
  thumnails: [],
  progressPicture: String
});


// Compile model from schema, name of collection in the
//first parameter, Mongoose will pluralize
const Post = model('Post', PostSchema);

export default Post;
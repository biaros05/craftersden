import { Schema, model } from 'mongoose';

// Define a schema
const UserSchema = new Schema({
  email: String,
  username: String,
  avatar: String,
  customized: {
    type: Boolean,
    default: false
  },
  liked: [],
  saved: []
});

// Compile model from schema, name of collection in the
//first parameter, Mongoose will pluralize
const User = model('User', UserSchema, 'users');

export default User;
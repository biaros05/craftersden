import { Schema, model } from 'mongoose';

// Define a schema
const UserSchema = new Schema({
  email: String,
  username: String,
  avatar: String
});

// Compile model from schema, name of collection in the
//first parameter, Mongoose will pluralize
const User = model('User', UserSchema);

export default User;
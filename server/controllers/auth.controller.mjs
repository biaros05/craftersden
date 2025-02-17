import User from '../models/User.js';
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Authenticates the user using googles OAuth
 * @param {object} req - Request
 * @param {object} res - Response
 * @returns {void}
 */
async function authenticateUser(req, res) {
  const {token} = req.body;
  if (!token) {
    return res.sendStatus(400);
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  if (!ticket) {
    return res.sendStatus(401);
  }

  const { name, email, picture } = ticket.getPayload();
  // We'll probably want to save those other fields too
  // We should probably use the email to find instead of username
  try {
    const user = await User.findOneAndUpdate(
      {email: email}, 
      {username: name, email: email, avatar: picture}, 
      {upsert: true}
    );
    req.session.regenerate(err => {
      if (err) {
        return res.status(500).json({message: 'Failed to create token'});
      }
    
      req.session.user = user;
      req.session.save(err => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save session' });
        }
        res.json({user: user});
      });
    });

  } catch (err) {
    console.error(`Failed to add user ${name}: `, err);
    return res.status(500).json({message: 'Failed to add user to DB'});
  }
}

/**
 * Logs out client making the request by destroying their session and clearing the cookie
 * @param {object} req - Request
 * @param {object} res - Response
 */
function logoutUser(req, res,) {
  req.session.destroy(function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    res.clearCookie('id');
    res.sendStatus(200);
  });  
}

/**
 * Returns requesting client's user object
 * @param {object} req - Request
 * @param {object} res - Response
 */
function queryUser(req, res) {
  res.json({user: req.session.user});
}

export {authenticateUser, logoutUser, queryUser};
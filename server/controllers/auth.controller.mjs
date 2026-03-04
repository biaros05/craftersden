import User from '../models/User.mjs';
import { OAuthService } from '../utils/auth.mjs';

const client = new OAuthService();

/**
 * Authenticates the user using googles OAuth
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function authenticateUser(req, res, next) {
  const {token} = req.body;
  if (!token) {
    return res.sendStatus(400);
  }

  try {
    const {name, email, picture} = await client.verifyToken(token);
    
    let user = await User.findOne({email: email});
    if (!user || !user.customized) {
      user = await User.findOneAndUpdate(
        {email: email}, 
        {username: name, email: email, avatar: picture}, 
        {upsert: true, returnDocument: 'after'}
      );
    }

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
    next(err);
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
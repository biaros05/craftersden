import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Checks if the requesting client is authenticated using its session
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {Function} next - Next callback
 * @returns {void}
 */
function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.sendStatus(401);
  }
  next();
}

class OAuthService {
  client = null;

  constructor() {
    this.createClient();
  }

  createClient() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyToken(token) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
      throw new Error('No ticket found');
    }

    return ticket.getPayload();
  }
}

export {isAuthenticated, OAuthService};

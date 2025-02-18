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
  
export {isAuthenticated};
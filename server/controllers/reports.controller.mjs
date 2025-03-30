import User from "../models/User.mjs";
import Post from "../models/Post.mjs";
import Report from "../models/Report.mjs";

/**
 * Creates a new report 
 * 
 * @param {object} req  - Request object
 * @param {object} res - Response object
 * @param {next} next  - Next function
 * @returns {Response} - Response object with status code and message
 */
async function createReport(req, res, next) {
  try{
    const {user_id, post_id, reporter, reason} = req.body;
    if (!(user_id || post_id) || !reporter || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace("T", " ");

    const userReport = new Report({
      user_id,
      post_id,
      reporter,
      reason,
      createdAt: timestamp
    });

    await userReport.save();

    return res.status(200).json({ message: 'Report created successfully' });
  } catch (err){
    err.status = 500;
    next(err);
  }
};

/**
 * Retrieves all reports from the database  
 *
 * @param {object} req  - Request object
 * @param {object} res - Response object
 * @param {next} next  - Next function
 * @returns {Response} - Response object with status code and message
 */
async function getReports(req, res, next) {
  try {
    const reports = await Report.find();
    return res.status(200).json({ message: 'Reports retrieved', reports });
  } catch (err) {
    err.status = 500;
    next(err);
  }
}

export { createReport, getReports };
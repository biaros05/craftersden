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

    const userReport = new Report({
      user_id,
      post_id,
      reporter,
      reason,
      createdAt: now
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

/**
 * Deletes a report 
 * 
 * @param {object} req  - Request object
 * @param {object} res - Response object
 * @param {next} next  - Next function
 * @returns {Response} - Response object with status code and message
 */
async function deleteReport(req, res, next){
  try{
    const report = await Report.findOneAndDelete({_id: req.body.id});
    if(!report){
      const err = new Error('Cannot find report in database');
      err.status = 404;
      return next(err);
    }

    return res.status(200).json({message: 'Report deleted'});

  } catch(err){
    err.status = 500;
    next(err);
  }
}

export { createReport, getReports, deleteReport };
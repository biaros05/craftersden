import Feedback from '../models/feedback.mjs';

/**
 * Creates a feedback with type, author and message. 
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response}- Response object with status code and message.
 */
async function createFeedback(req, res, next){
  try{
    const {type, author, message} = req.body;
    if(!type || !author || !message){
      return res.status(400).json({message: 'All fields required for feedback'});
    }
    const now = new Date();
    
    const feedback = new Feedback({
      type, 
      author,
      message,
      createdAt: now
    });

    await feedback.save();

    return res.status(200).json({message: 'Feedback sent succesfully'});
  } catch(err){
    err.status(500);
    next(err);
  }
}

/**
 *Gets all the feedbacks in database
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response}- Response object with status code and message.
 */
async function getFeedbacks(req, res, next){
  try{
    const feedbacks = await Feedback.find();
    return res.status(200).json({message: 'Feedbacks fetched', feedbacks});
  } catch(err){
    err.status = 500;
    next(err);
  }
};

/**
 *Deletes a feedback using its id.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response}- Response object with status code and message.
 */
async function deleteFeedback(req, res, next){
  try{
    const feedback = await Feedback.findOneAndDelete({_id : req.body.id});
    if(!feedback){
      const err = new Error('feedback id required');
      err.status = 403;
      return next(err);
    }

    return res.status(200).json({message: 'Feedback deleted'});
  } catch(err){
    err.status = 500;
    next(err);
  }
}

export {createFeedback, getFeedbacks, deleteFeedback};
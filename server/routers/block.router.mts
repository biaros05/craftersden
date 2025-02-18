import express from 'express';

const block = express.Router();

block.get('/blocks', (req, res) => {
  res.json({});
});

block.get('/blocks/:id', (req, res) => {
  res.json({});
});




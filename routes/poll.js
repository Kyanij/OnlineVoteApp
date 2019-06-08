const express = require('express');
const router = express.Router();
const Pusher = require('pusher');

const Vote = require('../models/Vote');


var pusher = new Pusher({
    appId: '788397',
    key: '1663376eb3dc9e9ea1cf',
    secret: '846a7515e369ccb0097f',
    cluster: 'ap2',
    encrypted: true
  });

router.get('/', (req, res) => {
  Vote.find().then( votes => {
    res.json({success: true, 
    votes: votes})
  })
})


router.post('/', (req,res) => {

  const newVote = {
    os: req.body.os,
    points: 1
  }

  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points:parseInt(vote.points),
      os:vote.os
    });
    
    return res.json({success: true, message: 'Thank You for voting', vote:req.body.os});

  })
  
})


let info = {
  id:1,
  name:'kyanij',
  age:22
}
router.get('/todo', (req,res) => {
  const msg = req.body.item
  return res.send(info)
})

module.exports = router;
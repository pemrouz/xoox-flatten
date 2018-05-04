const until = require('xoox-until')
    , transform = require('xoox')
    
// suprise: the transform function is also the flatten operator!
module.exports = (next, t) => (acc, v) => (
  transform(v, d => next(acc, d))(until(t.stopped)), acc
)
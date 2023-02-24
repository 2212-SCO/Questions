const model = require('../model');
const redis = require('../model/redis.js');


module.exports = {
  getQuestions(req, res) {
    let page = req.query.page || 1;
    let count = req.query.count || 5;
    let redisKey = req.query.product_id.toString() + 'page' + page.toString() + 'count' + count.toString();
    redis.get(redisKey)
      .then(data => {
        if(data) {
          console.log('information sent from redis');
          res.status(200).json(JSON.parse(data)).send()
        } else {
          model.getQuestions(req.query.product_id, count, page)
            .then((response) => {
              redis.set(redisKey, JSON.stringify(response));
              res.status(200).json(response).send();
            })
          .catch(err =>  res.status(500).send(err))
        }
      })
    //   .catch(err => console.log(err));
    //   res.status(200).json(redis.get(redisKey)).send()
    // } else {
    //   model.getQuestions(req.query.product_id, count, page)
    //     .then((response) => {
    //       redis.set(req.query.product_id.toString() + req.query.page.toString() + req.query.count.toString(), JSON.stringify(response));
    //       res.status(200).json(response).send()
    //     })
    //     .catch(err =>  res.status(500).send(err))
    // }
  }
}
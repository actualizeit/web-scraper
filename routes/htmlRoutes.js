const router = require('express').Router();

module.exports = (db) => {
  // Load register page
  router.get('/wut', (req, res) => {
      console.log("index")
      res.render('index');
    }
  );

  return router;
};
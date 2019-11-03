const router = require('express').Router();

module.exports = (db) => {
  // Load register page
  router.get('/home', (req, res) => {
      console.log("index")
      res.render('index');
    }
  );

  return router;
};
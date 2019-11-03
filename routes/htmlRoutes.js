const router = require('express').Router();
const db = require("../models");

module.exports = {
  // Load home page
  home: function(req, res) {
    console.log("index")
    res.render('index');
  return router;
    }
};
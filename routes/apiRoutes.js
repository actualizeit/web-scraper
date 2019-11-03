

const router = require('express').Router();

module.exports = (db) => {
const AppController = require('../controllers/appController')(db);
router.get('/scrape', AppController.scrape);
return router;
};
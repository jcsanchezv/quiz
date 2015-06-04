var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/*
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
*/

// autoload de comandos con :quizId
router.param('quizId', quizController.load); // autoload: quizId

// definición de rutas /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// autor
router.get('/author', quizController.author);

module.exports = router;

var models = require('../models/models.js');

/*
// GET /quizes/question
exports.question=function(req, res){
  // res.render('quizes/question', {pregunta: '¿Capital de Italia?'});
  models.Quiz.findAll().then(function(quiz){
    res.render('quizes/question', {pregunta: quiz[0].pregunta});
  })
};

// GET /quizes/answer
exports.answer = function(req, res){
  models.Quiz.findAll().then(function(quiz){
    if(req.query.respuesta === 'Roma'){
      res.render('quizes/answer', {respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
    }
  })
};
*/

// autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId= ' + quizId));
      }
    }
  ).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res){
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  }).catch(function(error){next(error);});
};

// GET /quizes/:id
exports.show = function(req, res){
/*
  models.Quiz.find(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {quiz: quiz});
  })
*/
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
/*
  models.Quiz.find(req.params.quizId).then(function(quiz){
    if(req.query.respuesta===quiz.respuesta){
      res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
    }else{
      res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
    }
  })
*/
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.search = function(req, res){
  var bus = req.query.texto_a_buscar.replace(/ /g,'');
  models.Quiz.findAll({where: ["pregunta like ?", '%' + bus + '%'], order: 'pregunta ASC'}).then(function(quizes){
    res.render('quizes/search.ejs', {quizes: quizes, errors: []});
  }).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate().then(function(err){
      if(err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        // guarda en BD pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
          res.redirect('/quizes');
        }); // redirecciona HTTP (URL relativo) lista preguntas
      }
    });
};

// GET autor
exports.author=function(req, res){
  res.render('author');
};

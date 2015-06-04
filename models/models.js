var path = require('path');

// PostgreSQL DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// cargar modelo ORM
var Sequelize = require('sequelize');

// usar BD SQLite o PostgreSQL
var sequelize = new Sequelize(DB_name, user, pwd,
  {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // sólo SQLite (.env)
    omitNull: true // sólo PostgreSQL
  }
);

// importar definición tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

/*
// usar SQlite
var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

// importar definición tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
*/

exports.Quiz = Quiz; // exporta definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en la BD

// sequelize.sync().sucess(function(){
sequelize.sync().then(function(){
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count===0){ // la tabla se inicializa sólo si está vacía
      // Quiz.create({ pregunta: '¿Capital de Italia?', respuesta: 'Roma'})
      Quiz.create({pregunta: '¿Capital de Italia?', respuesta: 'Roma'});
      Quiz.create({pregunta: '¿Capital de Portugal?', respuesta: 'Lisboa'})
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});

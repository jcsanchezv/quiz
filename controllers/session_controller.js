// MW autorización accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if(req.session.user){
		next();
	} else {
		res.redirect('/login');
	}
};

// GET /login --form login--
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login --crea sesión--
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if(error) { // si hay error devuelve mensajes de error de sesión
			req.session.errors = [{"message": 'Compruebe '+error}];
			res.redirect("/login");
			return;
		}

		// crear req.session.user y guardar campos id y username
		// la sesión se define por la existencia de req.session.user
		req.session.user = {id:user.id, username:user.username};

		res.redirect(req.session.redir.toString()); // redirecciona a path anterior
	});
};

// DELETE /logout --destruye sesión--
exports.destroy = function(req, res){
	if(req.session.user){
		delete req.session.user;
		res.redirect(req.session.redir.toString()); // redirecciona a path anterior
	} else {
		res.redirect('/');
	}
};
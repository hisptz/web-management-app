var util = require('util');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./store');
}

module.exports = function (app) {
    app.get('/login', function (req, res, next) {
        res.render('login', { flash: req.flash() } );
    });

    app.get('/signup', function (req, res, next) {
        res.render('signup', { flash: req.flash() } );
    });

	app.get('/', function (req, res, next) {
		res.render('index');
	});

    app.get('/signup', function (req, res, next) {
        res.render('signup');
    });

	app.get('/welcome', function (req, res, next) {
		res.render('welcome');
	});

	app.get('/secure', function (req, res, next) {
		res.render('secure');
	});

	app.post('/login', function (req, res, next) {

		// you might like to do a database look-up or something more scalable here
        var data = JSON.parse(localStorage.getItem("users"));
        var username = req.body.username;
        var pwd = req.body.password;
        function findPresenceOfObject() {
            for(var count=0; count < data.length; count++) {
                if (data[count].username === username && data[count].password === pwd) {
                    return 1
                }
            }
            return 2
        }

        var check = findPresenceOfObject();
        if (check === 1){
            req.session.authenticated = true;
            res.redirect('/secure');
		}else{
            req.flash('error', 'Wrong Credentials');
            res.redirect('/login');
		}
	});

	app.post('/signup', function (req, res, next) {
		//check if passwords are equal
        var data = JSON.parse(localStorage.getItem("users"));
		var pwd1 = req.body.password;
		var pwd2 = req.body.repassword;
		if (pwd1 === pwd2){
			//check if username exists
            var username = req.body.username;
            function checkUsername() {
                for(var count=0; count < data.length; count++) {
                    if (data[count].username === username) {
                        return 1
                    }
                }
                return 2
            }
            var test = checkUsername();
            if (test === 2){
            	//sign up the user (write  to the local storage)
				var new_user ={
					"username": username,
					"password": pwd1
				}
				data.push(new_user);
                localStorage.setItem('users',JSON.stringify(data));
                req.flash('success', 'Successfully done, you can sign In');
                res.redirect('/signup');
			}else{
                req.flash('error', 'Username exists');
                res.redirect('/signup');
			}
		}else{
            req.flash('error', 'Passwords do not match');
			res.redirect('/signup');
		}
    });

	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});

};

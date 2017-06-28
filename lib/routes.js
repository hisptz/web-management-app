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

    app.get('/personal_description/:id', function (req, res, next) {
        var data = JSON.parse(localStorage.getItem("team"));
        function getPersonalDetails() {
            for(var count=0; count < data.length; count++) {
                if (data[count].id === req.params.id) {
                    var fetched_details ={
                        "name": data[count].name,
                        "title": data[count].title,
                        "level": data[count].level,
                        "position": data[count].position,
                        "img_url": data[count].img_url,
                        "email": data[count].email,
                        "phone": data[count].phone,
                        "bio": data[count].bio
                    }
                    return fetched_details;
                }
            }
        }
        var details = getPersonalDetails();
        console.log(details);
        res.render('personal_description',{data: details});
    });

    app.get('/skills/:id', function (req, res, next) {
        var data = JSON.parse(localStorage.getItem("team"));
        function getSkills() {
            for(var count=0; count < data.length; count++) {
                if (data[count].id === req.params.id) {
                    var fetched_skills ={
                        "skills": data[count].skills
                    }
                    return fetched_skills;
                }
            }
        }
        var skills = getSkills();
        res.render('skills',{data: skills});
    });

    app.get('/experience/:id', function (req, res, next) {
        var data = JSON.parse(localStorage.getItem("team"));
        function getExperience() {
            for(var count=0; count < data.length; count++) {
                if (data[count].id === req.params.id) {
                    var fetched_skills ={
                        "experience": data[count].experience
                    }
                    return fetched_skills;
                }
            }
        }
        var experience_details = getExperience();
        res.render('experience',{experience: experience_details});
    });

    app.get('/education/:id', function (req, res, next) {
        var data = JSON.parse(localStorage.getItem("team"));
        function getEducation() {
            for(var count=0; count < data.length; count++) {
                if (data[count].id === req.params.id) {
                    var fetched_education ={
                        "education": data[count].education
                    }
                    return fetched_education;
                }
            }
        }
        var education_details = getEducation();
        res.render('education',{education: education_details});
    });

    app.get('/consultancy/:id', function (req, res, next) {
        var data = JSON.parse(localStorage.getItem("team"));
        function getConsultancy() {
            for(var count=0; count < data.length; count++) {
                if (data[count].id === req.params.id) {
                    var fetched_consultancy ={
                        "consultancy": data[count].consultancy
                    }
                    return fetched_consultancy;
                }
            }
        }
        var consultancy_details = getConsultancy();
        res.render('consultancy',{consultancy: consultancy_details});
    });

	app.get('/welcome', function (req, res, next) {
		res.render('welcome');
	});

	app.get('/secure/:id', function (req, res, next) {
		res.render('secure',{id: req.params.id});
	});

	app.post('/login', function (req, res, next) {

		// you might like to do a database look-up or something more scalable here
        var id;
        var data = JSON.parse(localStorage.getItem("users"));
        var username = req.body.username;
        var pwd = req.body.password;
        function findPresenceOfObject() {
            for(var count=0; count < data.length; count++) {
                if (data[count].username === username && data[count].password === pwd) {
                    id = username;
                    return "p:"+data[count].id;
                }
            }
            return 'np';
        }

        var check = findPresenceOfObject();
        if (check.split(":")[0] === 'p'){
            req.session.authenticated = true;
            res.redirect('/secure/'+check.split(":")[1]);
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

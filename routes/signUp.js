
var mysql=require("./mysql");

exports.signUp = function(req,res)
{
	res.render('signUp', { title: 'Twitter' });

}

exports.afterSignUp = function(req,res)
{
	var userName= req.param("username");
	var passwordNotEncrypted = req.param("password");
	var firstName= req.param("firstName");
	var email=req.param("email");
	var json_response;
	
	const crypto = require('crypto');
	crypto.pbkdf2(passwordNotEncrypted, userName, 100000, 512, 'sha512', (err, key) => {
	  if (err) throw err;
	  console.log(key.toString('hex'));  // 'c5e478d...1469e50'
	
	
	var user= {"TWITTER_HANDLE":userName,
				"PASSWORD":key.toString('hex'),
				"FIRST_NAME":firstName,
				"EMAIL":email};
	
	var insertUser="INSERT INTO USERS SET ?";
	
	mysql.insertData(insertUser,user,function(err,results) 
			{
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("Entry Inserted Successfully");
			console.log("Login Successful");
			req.session.username = userName;
			console.log("Session Initialized");
			json_responses = {"statusCode" : 200};
			res.send(json_response);
		}
	});
	});
}


exports.redirectToHomepage = function(req,res)
{
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
}
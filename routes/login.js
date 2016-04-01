var mysql=require("./mysql");

exports.login = function(req,res)
{
	res.render('login', { title: 'Twitter' });
}

exports.checkLogin = function(req,res)
{
	var username=req.param("username");
	var passwordNotEncrypted = req.param("password");
	
	const crypto = require('crypto');
	crypto.pbkdf2(passwordNotEncrypted, username, 100000, 512, 'sha512', (err, key) => {
	  if (err) throw err;
	  console.log(key.toString('hex'));  // 'c5e478d...1469e50'
	
	var json_response;
	var isUserExist = "select count(twitter_handle) as user_count from users where twitter_handle='"
		+username+"' and password='"+key.toString('hex')+"'" ;
	console.log(isUserExist);
	mysql.fetchData(function(err,results){
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	else
		{
			if(results.length>0)
			{
					var usernameCount = results[0].user_count;
					
					if(usernameCount==1)
					{
						json_responses = {"statusCode" : 200};
						console.log("\nUSERNAME:"+username);
						req.session.username = username;
					}
					else if(usernameCount==0)
					{
						json_responses = {"statusCode" : 201};
					}
					else if(usernameCount>1)
					{
						json_resonses = {"statusCode" : 401};
					}
					console.log(usernameCount);
					res.send(json_responses);
			}
			else
			{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}
		
		
	},isUserExist);
});
}
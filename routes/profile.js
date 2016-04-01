var mysql=require("./mysql");
var hash = require('hashtags');

exports.getProfile = function(req,res)
{
	var profileId = req.param("id");
	console.log(profileId);
	
	var tweets = {};
	var getUserDetails ="SELECT USER_ID, (SELECT COUNT(FOLLOWING_TWITTER_ID) FROM"
		+" FOLLOWERS WHERE FOLLOWING_TWITTER_ID=USER_ID) AS FOLLOWING_COUNT,"
		+"(SELECT COUNT(FOLLOWER_TWITTER_ID) FROM FOLLOWERS WHERE FOLLOWER_TWITTER_ID=USER_ID) AS FOLLOWER_COUNT,"
		+" (SELECT COUNT(FOLLOWING_TWITTER_ID) FROM FOLLOWERS WHERE FOLLOWING_TWITTER_ID "
		+"in (select USER_ID from USERS where TWITTER_HANDLE='"
		+ req.session.username +"') AND FOLLOWER_TWITTER_ID=USERS.USER_ID ) as IS_EXISITING_FOLLOWER"
		+",FIRST_NAME,LAST_NAME,EMAIL,date_format(dob,'%M %d %Y') as DOBF,LOCATION,PHONE_NUMBER "
		+"FROM USERS  WHERE TWITTER_HANDLE='"+profileId+"'";
	
	var userId;
	var json_responses ={};	
	mysql.fetchData(function(err,results) {
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
				userId = results[0].USER_ID;
				var followerCount = results[0].FOLLOWER_COUNT;
				var followingCount = results[0].FOLLOWING_COUNT;
				var lastName = results[0].LAST_NAME;
				var firstName = results[0].FIRST_NAME;
				var dob = results[0].DOBF;
				var email = results[0].EMAIL;
				var location = results[0].LOCATION;
				var phoneNumber = results[0].PHONE_NUMBER;
				var isExistingFollower = results[0].IS_EXISITING_FOLLOWER;
				
				
				console.log(userId);
				
				
				
				var getTweets="SELECT TWEET_ID,USER_ID,TWEET,TIME_STAMP FROM TWEETS WHERE USER_ID='"+userId+"'"
				+" ORDER BY TIME_STAMP DESC";
				
				var json_responses ={};	
				mysql.fetchData(function(errSelect,resultsSelect) {
					if(err)
					{
						throw err;
						json_responses = {"statusCode" : 401};
						res.send(json_responses);
					}
					else
					{
						if(resultsSelect.length>0)
						{
							tweets=resultsSelect;
							
							for(var i=0;i<tweets.length;i++)
							{
								var hashArray = [];
								hashArray = hash(tweets[i].TWEET);
								if(hashArray)
								{
									for(var j=0;j<hashArray.length;j++)
									{
										tweets[i].TWEET = tweets[i].TWEET.replace(hashArray[j]
										, "<a href=\\\'\\../hashtags/"+hashArray[j]+"\\\'"+"><b>"+hashArray[j]+"</b></a>");
										console.log(tweets[i].TWEET);
									}
								}
							}
							
							
							
							if(req.session.username)
							{
								//Set these headers to notify the browser not to maintain any cache for the page being loaded
								res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
								res.render('profile',{"profileId":profileId,
									"tweets":tweets,
									"follower_count":followerCount,
									"following_count":followingCount,
									"first_name":firstName,
									"last_name":lastName,
									"email":email,
									"dob":dob,
									"location":location,
									"phoneNumber":phoneNumber,
									"isExistingFollower":isExistingFollower,
									"username":req.session.username});
							}
							else
							{
								res.redirect('/login');
							}
						}
						else
						{
							
						}
						
					}
				}, getTweets);
				
			}
			else
			{
				//Error
			}}
	}, getUserDetails);
	
}


exports.followUser = function(req,res)
{
	profileId = req.param("profileId");
	username = req.session.username;
	
	
	var insertFollower = "INSERT INTO FOLLOWERS (FOLLOWING_TWITTER_ID,FOLLOWER_TWITTER_ID)"
		+"  SELECT (SELECT USER_ID FROM USERS WHERE TWITTER_HANDLE='"+username+"') "
		+"as following_twitter_id , (select user_id from users where twitter_handle="
		+"'"+profileId+"' )as follower_twitter_id from dual";
	
	mysql.insertData(insertFollower,function(err,results) 
			{
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("Entry Inserted Successfully");
			console.log("Login Successful");
			console.log("Session Initialized");
			var json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
	});
}


exports.unfollowUser = function(req,res)
{
	profileId = req.param("profileId");
	username = req.session.username;
	
	
	var deleteFollower ="delete from FOLLOWERS where following_twitter_id in "
		+"(SELECT USER_ID FROM USERS WHERE TWITTER_HANDLE='"+ username +"')"
		+" and FOLLOWER_TWITTER_ID in (select user_id from users "
		+"where twitter_handle='"+ profileId +"' )";
	
	
	
	mysql.deleteData(deleteFollower,function(err,results) 
			{
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("Entry Inserted Successfully");
			console.log("Login Successful");
			console.log("Session Initialized");
			var json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
	});
}

exports.editProfile = function(req,res)
{
	res.render('editProfile',req.session.username);
}

exports.fetchProfileData = function(req,res)
{
	var fetchUserDetails="SELECT * FROM USERS WHERE TWITTER_HANDLE='"+req.session.username+"'";

	
	mysql.fetchData(function(err,results) {
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
				json_responses = {"statusCode" : 200,"result":results[0]};
				res.send(json_responses);
			}
		}
	},fetchUserDetails);
}

exports.updateProfileData = function(req,res)
{
    var lastName = req.param("LAST_NAME");
	var dob = req.param("DOB").replace(/T.+/, '');
	var email = req.param("EMAIL");
	var phoneNumber = req.param("PHONE_NUMBER");
	var location = req.param("LOCATION");
	
	
	var updateUserDetails = "UPDATE USERS SET FIRST_NAME='"+req.param("FIRST_NAME")+"'";
	
	if(lastName)
	{
		updateUserDetails+=" ,LAST_NAME='"+lastName+"'";
	}
	
	if(dob)
	{
		updateUserDetails+=" ,DOB='"+dob+"'";
	}
	
	if(email)
	{
		updateUserDetails+=" ,EMAIL='"+email+"'";
	}
	
	if(phoneNumber)
	{
		updateUserDetails+=" ,PHONE_NUMBER='"+phoneNumber+"'";
	}
	
	if(location)
	{
		updateUserDetails+=" ,LOCATION='"+req.param("LOCATION")+"'";
	}
	
	
	
	updateUserDetails+=" WHERE TWITTER_HANDLE='"+req.session.username+"'";

	
	mysql.updateData(updateUserDetails,function(err,results) 
			{
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("Entry Inserted Successfully");
			console.log("Login Successful");
			console.log("Session Initialized");
			var json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
	});
	
}

exports.getBasicUserDetails = function(req,res)
{
	var getBasicUserDetails="SELECT USER_ID, (SELECT COUNT(FOLLOWING_TWITTER_ID) FROM"
		+" FOLLOWERS WHERE FOLLOWING_TWITTER_ID=USER_ID) AS FOLLOWING_COUNT,"
		+"(SELECT COUNT(FOLLOWER_TWITTER_ID) FROM FOLLOWERS WHERE FOLLOWER_TWITTER_ID=USER_ID) AS FOLLOWER_COUNT"
		+",FIRST_NAME,LAST_NAME,EMAIL,DOB,(SELECT COUNT(TWEET_ID) FROM TWEETS WHERE TWEETS.USER_ID=USERS.USER_ID) AS TWEET_COUNT "
		+"FROM USERS  WHERE TWITTER_HANDLE='"+req.session.username+"'";
	
	mysql.fetchData(function(err,results) {
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
				json_responses = {"statusCode" : 200,"result":results[0]};
				res.send(json_responses);
			}
		}
	},getBasicUserDetails);

}

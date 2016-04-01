var mysql=require("./mysql");
var hash = require('hashtags');

exports.getHomePage = function(req,res)
{
	if(req.session.username)
	{
		
		var tweets = {};
		var getUserDetails ="SELECT USER_ID, (SELECT COUNT(FOLLOWING_TWITTER_ID) FROM"
			+" FOLLOWERS WHERE FOLLOWING_TWITTER_ID=USER_ID) AS FOLLOWING_COUNT,"
			+"(SELECT COUNT(FOLLOWER_TWITTER_ID) FROM FOLLOWERS WHERE FOLLOWER_TWITTER_ID=USER_ID) AS FOLLOWER_COUNT"
			+",FIRST_NAME,LAST_NAME,EMAIL,DOB,(SELECT COUNT(TWEET_ID) FROM TWEETS WHERE TWEETS.USER_ID=USERS.USER_ID) AS TWEET_COUNT "
			+"FROM USERS  WHERE TWITTER_HANDLE='"+req.session.username+"'";
		
		var userId;
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
					var dob = results[0].DOB;
					var email = results[0].EMAIL;
					var tweet_count = results[0].TWEET_COUNT;
					
					
					console.log(userId);
					
					
//					
//					var getTweets="SELECT TWEET FROM TWEETS WHERE USER_ID='"+userId+"'"
//					+" ORDER BY TIME_STAMP DESC";
					
//					var getTweets="SELECT "
//									    +"tweets.* ,users.USER_ID as USER_ID,users.FIRST_NAME AS FIRST_NAME,users.LAST_NAME AS LAST_NAME, users.TWITTER_HANDLE"
//									+" FROM tweets  join users on users.USER_ID=tweets.USER_ID JOIN followers "
//									+" WHERE "
//									+"    (followers.follower_twitter_id = tweets.user_id "
//									+"  AND following_twitter_id ="+userId+" ) "
//									+"        OR tweets.user_id ="+userId
//									+" ORDER BY TWEETS.TIME_STAMP DESC LIMIT 10";
					
					
					var getTweets = "SELECT "
						+" tweets.*, "
    +" users.USER_ID AS USER_ID, "
    +"users.FIRST_NAME AS FIRST_NAME, "
    +" users.LAST_NAME AS LAST_NAME, "
    +" users.TWITTER_HANDLE, "
    +" o.time_Stamp AS ORIGINAL_TIME_STAMP, "
    +" OU.FIRST_NAME AS ORIGINAL_FIRST_NAME, "
    +" OU.LAST_NAME AS ORIGINAL_LAST_NAME, "
    +" OU.TWITTER_HANDLE AS ORIGINAL_TWITTER_HANDLE "
 +" FROM "
    +" tweets "
        +" LEFT OUTER JOIN "
    + "tweets o ON tweets.ORIGINAL_TWEET_ID = o.TWEET_ID LEFT OUTER	JOIN USERS OU "
       +" ON OU.USER_ID=O.USER_ID "
       +" JOIN "
    +" users ON users.USER_ID = tweets.USER_ID "
      +"  JOIN "
      +" followers ON followers.follower_twitter_id = tweets.user_id "
      +" WHERE "
    +" "
     +"  following_twitter_id = "+userId
      +"  OR tweets.user_id = "+ userId
+" ORDER BY TWEETS.TIME_STAMP DESC " ;
					
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
							tweets=resultsSelect;
							
							for(var i=0;i<tweets.length;i++)
							{
								var tweet= tweets[i].TWEET;
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
									res.render("homepage",{"username":req.session.username,
										"tweets":tweets,
										"follower_count":followerCount,
										"following_count":followingCount,
										"first_name":firstName,
										"last_name":lastName,
										"email":email,
										"dob":dob,
										"tweet_count":tweet_count});
								}
								else
								{
									res.redirect('/login');
								}
							}
							
					}, getTweets);
					
				}
				else
				{
					//Error
				}}
		}, getUserDetails);
		
		
		
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
//		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/login');
	}
}


exports.logout = function(req,res)
{
	console.log("in logout");
	req.session.destroy();
	res.redirect('/login');
	
};
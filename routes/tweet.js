
var mysql=require("./mysql");
var hash = require('hashtags');

exports.insertTweet = function(req,res)
{
	
	var tweet = req.param("tweet");
	var hashArray = hash(tweet);
	
	
	
	username =req.session.username;
	
	var getUserId="SELECT USER_ID FROM USERS WHERE TWITTER_HANDLE='"+username+"'";
	
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
				console.log(userId);
				
				var user= {"USER_ID":userId,
						"TWEET":tweet,
						"TIME_STAMP":new Date()};
				
			var insertTweet="INSERT INTO TWEETS SET ?";

			mysql.insertData(insertTweet,user,function(errInsert,resultsInsertTweet) 
					{
				if(errInsert)
				{
					throw errInsert;
				}
				else
				{
					var dualInput="";
					var inInput="";
					
					if(hashArray)
					{
					for(var i=0;i<hashArray.length;i++)
					{
						
						if(i!=0)
							{
							dualInput+=" union all ";
							inInput+=" , ";
							}
						inInput= inInput+"'"+hashArray[i]+"'";
						dualInput = dualInput+ " select '" + hashArray[i]+"' from dual ";
					}
					
					
					if(hashArray.length>0)
					{
					var insertHashtags = "insert into hashtags (HASHTAG) " + "select * from (" + dualInput 
								+" ) as temp WHERE NOT EXISTS"
								+ " ( SELECT HASHTAG FROM HASHTAGS WHERE HASHTAG IN ("+inInput+"))";
					
					
					mysql.insertDataWithoutJSON(insertHashtags,function(errInsert,resultsInsertHashTag) 
							{
						if(errInsert)
						{
							throw errInsert;
						}
						else
						{
							
							
							var insertHashTagUsed = "insert into hashtags_used   select hashtag_id,"+
							resultsInsertTweet.insertId+" from hashtags where hashtag in ("
							+ inInput +")";
							
							mysql.insertDataWithoutJSON(insertHashTagUsed,function(errInsert,resultsInsertHashTagUsed) 
									{
								if(errInsert)
								{
									throw errInsert;
								}
								else
								{
									json_responses = {"statusCode" : 200};
								}
								});
							
							
							
							
							console.log("tweet inserted");
							console.log("Session Initialized");
							json_responses = {"statusCode" : 200};
						}
					});
						
					
					}
				}
					console.log("tweet inserted");
					console.log("Session Initialized");
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
				}
			});
				
			}
			else
			{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}}
	}, getUserId);
	
	

}

exports.doRetweet = function(req,res)
{
	var tweetId= req.param("tweetId");
	
	var insertRetweet = "INSERT INTO TWEETS (USER_ID,TWEET,TIME_STAMP,ORIGINAL_TWEET_ID)"
		+" SELECT "
		+"(SELECT USER_ID FROM USERS WHERE TWITTER_HANDLE='"+req.session.username+"') AS USER_ID "
		+",TWEET, NOW() ,"+tweetId+" FROM TWEETS"
		+" WHERE TWEET_ID="+tweetId;
	
	
	mysql.insertData(insertRetweet,function(err,resultsTweets) 
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

exports.deleteTweet = function(req,res)
{
	
}
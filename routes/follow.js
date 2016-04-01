var mysql=require("./mysql");

exports.getFollowDetails = function(req,res)
{
	res.render('follow',{"username":req.session.username});
}

exports.getFollowing = function(req,res)
{
	var getFollowingDetails ="SELECT "
			+    " FU.USER_ID, FU.FIRST_NAME, FU.LAST_NAME, FU.TWITTER_HANDLE "
			+" FROM "
			+    " followers "
			+        " JOIN "
			+    " users ON followers.FOLLOWING_TWITTER_ID = users.USER_ID "
			+        " JOIN "
			+    " USERS FU ON FU.USER_ID = FOLLOWERS.FOLLOWER_TWITTER_ID "
			+ " WHERE "
			+    " users.TWITTER_HANDLE = '"+req.session.username+"'";
	
	
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
				json_responses = {"statusCode" : 200,"result":results};
				res.send(json_responses);
			}
		}
	},getFollowingDetails);

}

exports.getFollower = function(req,res)
{
	var getFollowerDetails = " SELECT "
    +" FU.USER_ID, "
    +" FU.FIRST_NAME, "
    +" FU.LAST_NAME, "
    +" FU.TWITTER_HANDLE, "
    +" CASE "
    +"    WHEN "
    +" (SELECT " 
    +"                COUNT(INNERFOLLOW.FOLLOWER_TWITTER_ID) "
    +"            FROM "
    +"                FOLLOWERS INNERFOLLOW "
    +"            WHERE "
    +"                INNERFOLLOW.FOLLOWING_TWITTER_ID = followers.FOLLOWER_TWITTER_ID "
    +"                    AND INNERFOLLOW.FOLLOWER_TWITTER_ID = followers.FOLLOWING_TWITTER_ID) > 0  "
    +"    THEN "
    +"        1 "
    +"    ELSE 0 "
    +" END AS ALREADY_FOLLOWING "
    +"   FROM "
    +" followers "
    +"    JOIN "
    +"  users ON followers.FOLLOWER_TWITTER_ID = users.USER_ID "
    +"    JOIN "
    +"  USERS FU ON FU.USER_ID = FOLLOWERS.FOLLOWING_TWITTER_ID "
    +"   WHERE "
    +"  users.TWITTER_HANDLE = '"+ req.session.username +"' ";
    
	
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
				json_responses = {"statusCode" : 200,"result":results};
				res.send(json_responses);
			}
		}
	},getFollowerDetails);

}
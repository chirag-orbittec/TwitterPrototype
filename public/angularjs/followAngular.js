var follow= angular.module("follow",['ngMaterial','ngMdIcons','ngSanitize']);

follow.controller("follow",['$scope','$http', '$sce',function($scope,$http,$sce){
	
	$scope.following=[];
	$scope.isFollowingPresent = false;
	
	$scope.follower = [];
	$scope.isFollowerPresent = false;
	
	$scope.userData=[];
	
	$scope.getFollowing = function()
	{
		$http({
			method:"POST",
			url:"/getFollowing",
			data:{
				
			}
		}).success(function(data){
			if(data.statusCode==401)
			{

			}
			else
			{
				$scope.following = data.result;
				$scope.isFollowingPresent = true;
			}
		}).error(function(error){

		});
		
	}
	
	$scope.getFollowing();
	
	$scope.getFollower = function()
	{
		$http({
			method:"POST",
			url:"/getFollower",
			data:{
				
			}
		}).success(function(data){
			if(data.statusCode==401)
			{

			}
			else
			{
				$scope.follower = data.result;
				$scope.isFollowerPresent = true;
			}
		}).error(function(error){

		});
		
	}
	
	$scope.getFollower();
	
	$scope.getBasicUserDetails = function()
	{
		
		$http({
			method:"POST",
			url:"/getBasicUserDetails",
			data:{
				
			}
		}).success(function(data){
			if(data.statusCode==401)
			{

			}
			else
			{
				$scope.userData = data.result;
			}
		}).error(function(error){

		});
		
		
	}
	
	$scope.getBasicUserDetails();
	
}]);

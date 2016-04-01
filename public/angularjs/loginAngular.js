var login= angular.module("login",['ngMaterial']);

login.controller("login",function($scope,$http){
	

	$scope.invalid_Login = true;	
	$scope.unexpected_error=true;

	$scope.submit= function(){
		$http({
		method:"POST",
		url:"/checkLogin",
		data:{
			"username":$scope.username,
			"password":$scope.password
		}
		}).success(function(data){
			if(data.statusCode==401)
				{
				$scope.invalid_Login=false;
				$scope.unexpected_error=true;
				}
			
			else if(data.statusCode==200)
				{
				window.location.assign("/homepage");
				}
			else if(data.statusCode==201)
				{
				$scope.invalid_Login=false;
				$scope.unexpected_error=true;
				}
			else
				{
				$scope.invalid_Login = true;	
				$scope.unexpected_error=false;
				}
		}).error(function(error){
			$scope.invalid_Login=true;
			$scope.unexpected_error=false;
		});
	}
		


});
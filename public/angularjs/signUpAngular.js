var signUp= angular.module("signUp",['ngMaterial']);

signUp.controller("signUp",function($scope,$http){
	
	var firstName=$scope.firstName;
	var email=$scope.email;
	var password=$scope.password;
	var username=$scope.username;
	$scope.displayUserNamePage=false;
	$scope.displaySignUpPage=true;
	
	
	$scope.signUp = function()
	{
		$scope.displayUserNamePage=true;
		$scope.displaySignUpPage=false;
		
	}
	
	
	$scope.submit= function(){
		$http({
		method:"POST",
		url:"/afterSignUp",
		data:{
			"username":$scope.username,
			"password":$scope.password,
			"firstName":$scope.firstName,
			"email":$scope.email
		}
		}).success(function(data){
			if(data.statusCode==401)
				{
				$scope.invalid_Login=false;
				$scope.unexpected_error=true;
				}
			else
				{
				window.location.assign("/homepage");
				}
		}).error(function(error){
			$scope.invalid_Login=true;
			$scope.unexpected_error=false;
		});
	}
	
	
	
});
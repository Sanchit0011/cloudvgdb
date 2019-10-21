app.controller('loginCtrl', function ($scope, $http, $timeout) {

$scope.loginMessage="";


    $scope.confirmLogin = function () {
        $http({
            method: 'POST',
            url: 'https://vgdbnode.appspot.com/login',
            data: $scope.user
        }) .then(function (response) {
            if(response.data == 'Credentials valid') {
                $scope.loginMessage = "Welcome" + " " + $scope.user.username;
                $scope.color= {
                    "color": "blue"
                }

                

                $timeout(function () {
                    localStorage.setItem("username", $scope.user.username);
                    window.location.reload();
                  }, 2000);
            }

            else if(response.data == 'Invalid credentials') {
                $scope.loginMessage = "Invalid login credentials";
                $scope.color= {
                    "color": "red"
                }
            }
        });
    }
});
app.controller('homeCtrl', function ($scope, $rootScope, $timeout) {

    $rootScope.page = 'Home';

    $rootScope.isLoggedIn = function() {
    if (localStorage.length > 0) {
        return true;
      } else {
        return false;
      }
}

$scope.logout = function() {
  
    localStorage.clear();
    window.location.reload();
}

})
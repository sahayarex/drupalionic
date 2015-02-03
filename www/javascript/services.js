angular.module('starter.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, $q, authService, $httpBackend, $location) {
  var baseUrl = 'http://192.168.1.10';
  var baseUrl = 'http://localhost';
  //var baseUrl = 'http://axis.moolah.co.in';
  var loginEndpoint       = baseUrl +'/drupalionic/user/login';
  var logoutEndpoint       = baseUrl +'/drupalionic/user/logout';
  var token = localStorage.getItem('token') || '';
  if(token) {
    $http.defaults.headers.common.Authorization = token;
    $http.defaults.headers.post['X-CSRF-TOKEN']= token;  
  }

  var service = {
    login: function(user) {
      $http.post(loginEndpoint, user, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {
        $http.defaults.headers.common.Authorization = data.token;
        $http.defaults.headers.post['X-CSRF-TOKEN'] = data.token;
        $http.defaults.headers.post['XSRF-TOKEN'] = data.token;
        var prevUserUid = localStorage.getItem('uid') || '';
        if(prevUserUid && (prevUserUid != data.user.uid)) {
          localStorage.removeItem('userSites'+prevUserUid);
          localStorage.removeItem('localData');
        }
        localStorage.setItem('uid', data.user.uid);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        authService.loginConfirmed(data, function(config) { 
          config.headers.Authorization = data.token;
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
        var error = "Login failed.";
        if (status == 401) {
          error = "Invalid Username or Password.";
        } else if (status == 404) {
          error = "Backend is not configured properly"; 
        }
        alert(error);
      });
    },
    logout: function(user) {
      $http.post(logoutEndpoint, {}, { ignoreAuthModule: true })
      .finally(function(data) {
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });			
    },	
    loginCancelled: function() {
      authService.loginCancelled();
    },
    getNodes: function(nodeData) {
      var defer = $q.defer();
      $http.post(baseUrl+'/drupalionic/drupalionic_resources/get_nodes', nodeData)
      .success(function(data, status, headers, config){
        localStorage.setItem('processing', 'No');
        defer.resolve(data);
      }).error(function(data, status, headers, config){
        localStorage.setItem('processing', 'No');
        defer.reject(data);
      }); 
      return defer.promise;
    },        
    saveNodeInServer: function(monitorDetails, key) {
      var defer = $q.defer();
      console.log('monitorDetails', monitorDetails);
      $http.post(baseUrl+'/drupalionic/drupalionic_resources/custom_node_save', monitorDetails)
      .success(function(data, status, headers, config){
        defer.resolve(data);
      }).error(function(data, status, headers, config){
        defer.reject(data);
      }); 
      return defer.promise;
    },
    savePhotoNodeInServer: function(sm, key) {
      var defer = $q.defer();
      sm.photos = {};
      var totalPhotos = Object.keys(sm.pictures).length;
      var i = 0;
      angular.forEach(sm.pictures, function(v, k) {
        var myImg = v;
        var options = new FileUploadOptions();
        options.fileKey="mobile";
        options.fileName = sm.siteCode;
        options.mimeType="image/jpeg";
        options.chunkedMode = false;
        var params = {};
        params.uid = sm.uid;
        params.site = sm.site;
        options.params = params;
       // alert(JSON.stringify(options, null, 4));
        var ft = new FileTransfer();
        ft.upload(myImg, encodeURI(baseUrl+"/save-photo"), onUploadSuccess, onUploadFail, options);
        function onUploadSuccess(r) {
          sm.photos[i] = {'fid': r.response.replace(/"/g, '')};
          i++;
          if(i == totalPhotos) {          
            $http.post(baseUrl+'/drupalionic/drupalionic_resources/custom_node_save', sm)
            .success(function(data, status, headers, config){
              defer.resolve(data);
            }).error(function(data, status, headers, config){
              defer.reject(data);
            });
          } 
        }
        function onUploadFail(error) {
          defer.reject(data);
        }
      });
      return defer.promise;
    },
    removeNodeInServer: function(nid) {
      var defer = $q.defer();
      $http({
        method    : 'POST', 
        url       : baseUrl+'/drupalionic/drupalionic_resources/custom_node_delete',
        dataType  : 'json',
        data      : 'nid='+nid,
        headers   : {
            "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .success(function(data, status, headers, config){
          alert('Entry deleted successfully');
          defer.resolve(data);
      }).error(function(data, status, headers, config){
          alert('Entry deleting failed');
          defer.reject(data);
      }); 
      return defer.promise;
    },    
    online: function() {
      if(navigator.platform == "Linux x86_64") {
        return true;
      }

      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.NONE] = 'No network connection';
      if (states[networkState] == 'No network connection') {
        return false;
      }
      else {
        return true;
      }
    },
    baseUrl: baseUrl
  };
  return service;
})

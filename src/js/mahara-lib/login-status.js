/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function getLoginStatus(successCallback, errorCallback){
  var url = this.getWwwroot(),
      userHomePath = "/user/view.php";

  // TODO: Cache logged in status for a minute or something

  if(!url) {
    console.log("no url");
    return errorCallback();
  }

  httpLib.get(url + userHomePath, undefined, successFrom(successCallback, errorCallback), failureFrom(errorCallback));

  function successFrom(successCallback, errorCallback){
    return function(response){
      var LOGGED_IN = /\?logout/,
          isLoggedIn;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, isLoggedIn:false, data:response});

      successCallback(!!response.target.response.match(LOGGED_IN));
    };
  }

  function failureFrom(errorCallback){
    return function(response){
      errorCallback({error:true, isLoggedIn:false, data:response});
    };
  }

}

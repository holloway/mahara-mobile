/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function logOut(successCallback, errorCallback){
  var logoutPath = "/?logout",
      protocolAndDomain = this.getUrl();

  if(!protocolAndDomain){
    errorCallback({error:true, noProtocolOrDomain:true, data:this});
    return;
  }

  var successFrom = function(successCallback, errorCallback){
    return function(response){
      var LOGGEDIN = [/\?logout/];

      if(!response || !response.target || !response.target.response){
        errorCallback(undefined);
        return;
      }

      successCallback(!!response.target.response.match(LOGGEDIN[0]));
    };
  };

  var failureFrom = function(callback){
    return function(response){
      errorCallback({error:true, data:response});
    };
  };

  httpLib.get(protocolAndDomain + logoutPath, undefined, successFrom(successCallback, errorCallback), failureFrom(errorCallback));
}
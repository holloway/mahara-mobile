/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function logOut(callback){
  var logoutPath = "/?logout",
      protocolAndDomain = this.getServerProtocolAndDomain();

  if(!protocolAndDomain){
    callback(undefined);
    return;
  }

  var successFrom = function(callback){
    return function(response){
      var LOGGEDIN = [/\?logout/];

      if(!response || !response.target || !response.target.response){
        callback(undefined);
        return;
      }

      callback(!!response.target.response.match(LOGGEDIN[0]));
    };
  };

  var failureFrom = function(callback){
    return function(response){
      callback(undefined);
    };
  };

  httpLib.get(protocolAndDomain + logoutPath, undefined, successFrom(callback), failureFrom(callback));
}
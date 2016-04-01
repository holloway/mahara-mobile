/*jshint esnext: true */
import httpLib from './http-lib.js';

export default function getSyncData(callback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      syncPath = "/api/mobile/sync.php",
      that = this,
      successFrom,
      failureFrom;

  if(!protocolAndDomain){
    callback(undefined);
    return;
  }

  successFrom = function(callback){
    return function(response){
      var jsonResponse;
      if(!response || !response.target || !response.target.response){
        callback(undefined);
        return;
      }

      try {
        jsonResponse = JSON.parse(response.target.response);
      } catch(e){
        console.log("Problem parsing JSON response", e, response.target.response);
      }

      if(!jsonResponse || jsonResponse.fail){
        callback({error:true, noPermission:true, message:jsonResponse.fail});
        return;
      }

      console.log("getsyncdata", response.target.response);
      callback(jsonResponse);
    };
  };

  failureFrom = function(callback){
    return function(response){
      callback(undefined);
    };
  };

  console.log("zzz",that);

  this.checkIfLoggedIn(function(isLoggedIn, settings){
    console.log("is logged in", isLoggedIn, settings);
    httpLib.get(protocolAndDomain + syncPath, {token:that.uploadToken, username:settings.username}, successFrom(callback), failureFrom(callback));
  });

}
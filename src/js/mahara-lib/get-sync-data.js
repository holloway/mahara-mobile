/*jshint esnext: true */
import httpLib from './http-lib.js';

export default function getSyncData(successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      syncPath = "/api/mobile/sync.php",
      that = this;

  if(!protocolAndDomain) return errorCallback({error:true});

  this.setMobileUploadToken(that.generateUploadToken(), function(uploadToken, userData){
    httpLib.get(protocolAndDomain + syncPath, {token:uploadToken, username:userData.username}, successFrom(successCallback, errorCallback), failureFrom(errorCallback));
  }, failureFrom(errorCallback));

  function successFrom(successCallback, errorCallback){
    return function(response){
      var jsonResponse;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, syncDataError:true});

      try {
        jsonResponse = JSON.parse(response.target.response);
      } catch(e){
      }

      if(!jsonResponse || jsonResponse.fail) return errorCallback({error:true, noPermission:true, message:jsonResponse.fail, data:jsonResponse});

      console.log("succes????!?", jsonResponse);

      successCallback(jsonResponse);
    };
  }

  function failureFrom(callback){
    return function(response){
      callback(response);
    };
  }

}
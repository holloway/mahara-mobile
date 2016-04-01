/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function uploadJournal(title, body, tags, callback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      uploadPath = "/api/mobile/upload.php",
      that = this,
      successFrom,
      failureFrom;

  if(!protocolAndDomain){
    callback(undefined);
    return;
  }

  successFrom = function(callback){
    return function(response){
      var responseJSON;
      console.log("success response", response);

      if(!response || !response.target || !response.target.response){
        callback(undefined);
        return;
      }

      try {
        responseJSON = JSON.parse(response.target.response);
      } catch(e){
        console.log("Response wasn't JSON. Was: ", response.target.response, e, response);
        callback(undefined);
        return;
      }

      if(!responseJSON){
        console.log("Response wasn't JSON. Was: ", response.target.response, e, response);
        callback(undefined);
        return;
      }

      if(responseJSON.fail){
        callback({error:true, message: responseJSON.fail, obj:responseJSON});
        return;
      }
      callback();
    };
  };

  failureFrom = function(callback){
    return function(response){
      console.log("failure", response);
      callback(undefined);
    };
  };

  this.checkIfLoggedIn(function(isLoggedIn, settings){
    console.log("!settings", settings);
    if(!isLoggedIn) return callback({error:true, isLoggedIn:isLoggedIn});
    var postData = {
      title: title,
      description: body,
      token:       that.uploadToken,
      username:    settings.username, //settings ? settings.userid : undefined
      foldername:  ''
    };
    console.log("!postdata", postData);
    that.getSyncData(function(syncData){
      console.log("syncData", syncData);
      postData.blog = (postData && postData.blog && postData.blog.length > 0) ? postData.blog[0].id : undefined;
      httpLib.post(protocolAndDomain + uploadPath, undefined, postData, successFrom(callback), failureFrom(callback));
    });

  });
}
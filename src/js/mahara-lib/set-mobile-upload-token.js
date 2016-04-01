/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function setMobileUploadToken(token, callback){
  var tokenPath = "/account/index.php",
      fieldName = "accountprefs_mobileuploadtoken[0]",
      successFrom,
      failureFrom,
      that = this,
      METHOD_GET = "GET",
      METHOD_POST = "POST",
      postData = {},
      sesskey; //named after Mahara Server key

  postData[fieldName] = token;

  var protocolAndDomain = this.getServerProtocolAndDomain();
  if(!protocolAndDomain){
    callback(undefined);
    return;
  }

  successFrom = function(callback, method){
    return function(response){
      var tags,
          i,
          wasUpdated;

      if(!response || !response.target || !response.target.response){
        callback(undefined);
        return;
      }

      if(method === METHOD_GET){
        tags = response.target.response.match(/<[^>]+>/g);
        for(i = 0; i < tags.length; i++){
          if(tags[i].match(/name=["']sesskey["']/)){
            var matches = tags[i].match(/value=["']([^"']+)["']/);
            if(matches.length > 1){
              sesskey = matches[1];
            }
          }
        }
        if(!sesskey){
          callback({error:true, sesskeyError:true});
          return;
        } else {
          postData.sesskey = sesskey;
          postData.pieform_accountprefs = ""; // form must have these to be accepted by Mahara Server
          postData.pieform_jssubmission = "1";
          httpLib.post(protocolAndDomain + tokenPath, undefined, postData, successFrom(callback, METHOD_POST), failureFrom(callback, METHOD_POST));
        }
      } else {
        wasUpdated = !!response.target.response.match(sesskey);
        if(wasUpdated){
          that.uploadToken = token;
        }
        callback(wasUpdated);
      }
    };
  };

  failureFrom = function(callback, method){
    return function(response){
      console.log("setMobileUploadToken: failure response", response);
      callback(undefined);
    };
  };

  this.checkIfLoggedIn(function(isLoggedIn){
    if(!isLoggedIn) return callback({error:true, isLoggedIn:isLoggedIn});
    // first, we need to scrape the session key
    httpLib.get(protocolAndDomain + tokenPath, undefined, successFrom(callback, METHOD_GET), failureFrom(callback, METHOD_GET));
  });
}
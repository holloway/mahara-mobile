/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function setMobileUploadToken(token, successCallback, errorCallback){
  var tokenPath = "/account/index.php",
      fieldName = "accountprefs_mobileuploadtoken[",
      protocolAndDomain = this.getServerProtocolAndDomain(),
      that = this,
      METHOD_GET = "GET",
      METHOD_POST = "POST",
      sesskey; //named after Mahara Server's variable name

  if(!protocolAndDomain) return errorCallback({error:true, message:"No protocol and domain from set-mobile-upload.js"});

  this.checkIfLoggedIn(function(userData){
    // first, we need to scrape the session key
    httpLib.get(protocolAndDomain + tokenPath, undefined, successFrom(successCallback, errorCallback, METHOD_GET, userData), failureFrom(errorCallback, METHOD_GET));
  }, errorCallback);

  function successFrom(successCallback, errorCallback, method, userData){
    return function(response){
      var uploadTokenNextIndex = 0,
          existingTokens,
          postData = {},
          tags,
          i;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, message:"Unable to set token.", data:response});

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

        if(!that.uploadTokenIndexes) that.uploadTokenIndexes = {};

        existingTokens = response.target.response.replace(/accountprefs_mobileuploadtoken\[(\d+)\]([^>]*?)>/g, function(match, index, remainder){
          var uploadTokenParts = remainder.match(/value=['"](.*?)['"]/);
          index = parseFloat(index);
          if(uploadTokenParts.length > 1 && uploadTokenParts[1].length > 0){
            that.uploadTokenIndexes[index] = uploadTokenParts[1];
            if(uploadTokenNextIndex < index) uploadTokenNextIndex = index;
          }
        });

        for(i in that.uploadTokenIndexes){
          if(that.uploadTokenIndexes.hasOwnProperty(i)){
            postData["accountprefs_mobileuploadtoken[" + i + "]"]  = that.uploadTokenIndexes[i];
            if(uploadTokenNextIndex < parseFloat(i)) uploadTokenNextIndex = parseFloat(i);
          }
        }

        uploadTokenNextIndex++; // use next available index
        that.uploadTokenIndexes[uploadTokenNextIndex] = token;
        postData["accountprefs_mobileuploadtoken[" + uploadTokenNextIndex + "]"] = token;

        if(!sesskey){
          return errorCallback({error:true, sesskeyError:true});
        } else {
          postData.sesskey = sesskey;
          postData.pieform_accountprefs = ""; // form must have these to be accepted by Mahara Server
          postData.pieform_jssubmission = "1";
          httpLib.post(protocolAndDomain + tokenPath, undefined, postData, successFrom(successCallback, errorCallback, METHOD_POST, userData), failureFrom(errorCallback, METHOD_POST));
        }
      } else {
        if(!!response.target.response.match(token)){ // ensure token is in response
          successCallback(token, userData);
        } else {
          errorCallback({error:true, data:response.target, message:"Couldn't find token in response"});
        }
      }
    };
  }

  function failureFrom(errorCallback, method){
    return function(response){
      errorCallback({error:true, message:"Unable to set token.", data:response});
    };
  }

}
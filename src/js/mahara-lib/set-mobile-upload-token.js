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

  if(!that.uploadTokenNextIndex) that.uploadTokenNextIndex = 0;

  this.getLoginStatus(afterLoginStatusCheck, errorCallback);

  function afterLoginStatusCheck(loggedIn){
    if(loggedIn){
      // first, we need to scrape the session key
      httpLib.get(protocolAndDomain + tokenPath, undefined, successFrom(successCallback, errorCallback, METHOD_GET), failureFrom(errorCallback, METHOD_GET));
    } else {
      errorCallback({error:true, isLoggedIn:false});
    }
  }


  function successFrom(successCallback, errorCallback, method){
    return function(response){
      var existingTokens,
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

        if(!sesskey){
          console.log("Unable to scrape sesskey from ", response.target.response);
          return errorCallback({error:true, scrapingSesskeyProblem:true, message: "No sesskey found in response.", data:response.target.response});
        } else {
          console.log("Able to scrape sesskey", sesskey);
        }

        if(!that.uploadTokenIndexes) that.uploadTokenIndexes = {};

        existingTokens = response.target.response.replace(/accountprefs_mobileuploadtoken\[(\d+)\]([^>]*?)>/g, function(match, index, remainder){
          var uploadTokenParts = remainder.match(/value=['"](.*?)['"]/);
          index = parseFloat(index);
          if(uploadTokenParts.length > 1 && uploadTokenParts[1].length > 0){
            that.uploadTokenIndexes[index] = uploadTokenParts[1];
            if(that.uploadTokenNextIndex < index) that.uploadTokenNextIndex = index;
          }
        });

        for(i in that.uploadTokenIndexes){
          if(that.uploadTokenIndexes.hasOwnProperty(i)){
            postData["accountprefs_mobileuploadtoken[" + i + "]"]  = that.uploadTokenIndexes[i];
            if(that.uploadTokenNextIndex < parseFloat(i)) that.uploadTokenNextIndex = parseFloat(i);
          }
        }

        that.uploadTokenNextIndex++; // use next available index
        that.uploadTokenIndexes[that.uploadTokenNextIndex] = token;
        postData["accountprefs_mobileuploadtoken[" + that.uploadTokenNextIndex + "]"] = token;

        postData.sesskey = sesskey;
        postData.pieform_accountprefs = ""; // form must have these to be accepted by Mahara Server
        postData.pieform_jssubmission = "1";
        httpLib.post(protocolAndDomain + tokenPath, undefined, postData, successFrom(successCallback, errorCallback, METHOD_POST), failureFrom(errorCallback, METHOD_POST));
      } else {
        if(!!response.target.response.match(token)){ // ensure token is in response
          successCallback(token);
        } else {
          errorCallback({error:true, tokenNotSet:true, data:response.target, message:"Couldn't find token in response"});
        }
      }
    };
  }

  function failureFrom(errorCallback, method){
    return function(response){
      errorCallback({error:true, tokenNotSet:true, message:"Unable to set token.", data:response});
    };
  }

}
/*jshint esnext: true */
import httpLib from './http-lib.js';
import {LOGIN_TYPE} from './constants.js';
import JSON5 from 'json5';

export default function getUserProfile(successCallback, errorCallback){
  switch(this.loginType){
    case LOGIN_TYPE.LOCAL:
      this.getLocalLoginProfile(successCallback, errorCallback);
      break;
    case LOGIN_TYPE.SINGLE_SIGN_ON:
      this.getSSOProfile(successCallback, errorCallback);
      break;
    default:
      console.log("Error: Unable to determine loginType", this.loginType, this);
      //TODO: check if logged in, then try both
  }
}

export function parseUserConfigFromHTML(htmlString){
  var settings;

  // begin ugly scraping code...
  htmlString.replace(/<script[\s\S]*?\/script>/g, function(regexMatch){
    if(regexMatch.match(/config[\s]*?\=[\s]*?/)){
      regexMatch = regexMatch.replace(/<[^>]*?>/g, '')
                             .replace(/^[\s\S]*?config[\s]*?\=[\s]*?/g, '')
                             .replace(/('[^']+')/g, function(keyMatch){
                                return '"' + keyMatch.substr(1, keyMatch.length - 2) + '"';
                             })
                             .replace(/\}[\s]*?;/g, '}')  // remove trailing ';'
                             .replace(/'"/g, '""')
                             .replace(/':/g, '":');

      try {
        settings = JSON5.parse(regexMatch);
      } catch(e){
        console.log("Problem extracting metadata", regexMatch, e, settings);
      }
    }
  });
  if(!settings) settings = {};
  return settings;
}


export function getLocalLoginProfile(successCallback, errorCallback){
  var protocolAndDomain = this.getUrl(),
      userHomePath = "/account/index.php",
      that = this;

  httpLib.get(protocolAndDomain + userHomePath, undefined, successFrom(successCallback, errorCallback), failureFrom(errorCallback));

  function successFrom(successCallback, errorCallback){
    return function(response){
      var LOGGED_IN = /id\s*=\s*["']accountprefs_username["']/,
          isLoggedIn,
          results,
          settings,
          tags;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, isLoggedIn:false, data:response});

      isLoggedIn = !!response.target.response.match(LOGGED_IN);

      settings = parseUserConfigFromHTML(response.target.response);

      tags = response.target.response.match(/<[^>]*?>/g);

      if(tags){
        tags.map(function(tag){
          var valueMatches;
          if(tag.match(LOGGED_IN)){
            valueMatches = tag.match(/value\s*=\s*["']([^"']+)["']/);
            if(valueMatches && valueMatches.length){
              settings.username = valueMatches[1];
            }
          }
        });
      }

      if(!settings.username){
        return errorCallback({error:true, usernameUnavailable:true, data:response.target});
      }

      successCallback(settings);
    };
  }

  function failureFrom(errorCallback){
    return function(response){
      errorCallback({error:true, isLoggedIn:false, data:response});
    };
  }

}


export function getSSOProfile(successCallback, errorCallback){
  var protocolAndDomain = this.getUrl(),
      userHomePath = "/user/view.php",
      that = this;

  httpLib.get(protocolAndDomain + userHomePath, undefined, successFrom(successCallback, errorCallback), failureFrom(errorCallback));

  function successFrom(successCallback, errorCallback){
    return function(response){
      var settings,
          matches;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, isLoggedIn:false, data:response});

      settings = parseUserConfigFromHTML(response.target.response);

      // Title looks like,
      //  <title>FirstName LastName (username) - Mahara</title>
      // And we want to extract the username portion
      matches = response.target.response.match(/<title>([^<]+)</);
      if(matches && matches.length && matches[1].indexOf("(") !== -1){
        settings.username = matches[1].replace(/^.*?\(/, '').replace(/\).*?$/, '');
      }

      if(!settings.username){
        return errorCallback({error:true, usernameUnavailable:true, data:response.target});
      }

      successCallback(settings);
    };
  }

  function failureFrom(errorCallback){
    return function(response){
      errorCallback({error:true, isLoggedIn:false, data:response});
    };
  }

}
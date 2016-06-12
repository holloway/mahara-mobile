/*jshint esnext: true */
import httpLib      from './http-lib.js';

import {parseUserConfigFromHTML} from './get-user-profile.js';

export default function localLogin(username, password, successCallback, errorCallback){
  var url = this.getUrl(),
      loginPath = "/",
      that = this;

  if(!url) return errorCallback({error: "No URL configured."});

  httpLib.postText(url + loginPath, undefined, {
      login_username:username,
      login_password:password,
      submit:"Login",
      login_submitted: 1,
      sesskey: "",
      pieform_login: "",
    }, scrapeFromResponse(successCallback, errorCallback), errorCallback);

  function scrapeFromResponse(successCallback, errorCallback){
    return function(response){
      var sessionDetails = /loggedin["']\s*?:\s*?1/,
          closingScriptTag = "</script>",
          responseData,
          loggedIn,
          settings;

      if(!response.target || !response.target.response){
        console.log("Unable to scrape session from response so can't login (1). Response was", response.target);
        return errorCallback({error:true, data:response.target});
      }

      if(!response.target.response.match(sessionDetails) || !response.target.response.match(closingScriptTag)){
        console.log("Unable to scrape session from response so can't login (2). Response was", response.target);
        return errorCallback({error:true, loggedIn:false, data:response.target});
      }

      settings = parseUserConfigFromHTML(response.target.response);

      loggedIn = (parseFloat(settings.loggedin) === 1);

      successCallback({error: !loggedIn, loggedIn:loggedIn, data:settings});
    };
  }
}
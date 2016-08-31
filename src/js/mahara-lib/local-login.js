/*jshint esnext: true */
import httpLib      from './http-lib.js';

import {parseUserConfigFromHTML} from './get-user-profile.js';

export default function localLogin(username, password, successCallback, errorCallback){
  var url = this.getWwwroot(),
      loginPath = "webservice/gentoken-via-userpass.php",
      // TODO: auto-register the MaharaMobile ws service group
      mobileApiService = "UserToken User Query",
      mobileApiComponent = "webservice",
      maharaServer = this;

  if(!url) return errorCallback({error: "No URL configured."});

  httpLib.getAsJSON(
    url + loginPath,
    {
      "username": username,
      "password": password,
      "service": mobileApiService,
      "component": mobileApiComponent,
    },
    (json) => {
      if (!json.token) {
        errorCallback.call(this, json, json);
      }
      this.setAccessToken(json.token);   // Call any webservice functions here that are needed to get user connection information
      console.log('Success!');
    },
    errorCallback
  );
}

export function getAccessToken() {
  return this.accesstoken;
}

export function setAcessToken(token) {
  this.accesstoken = token;
}
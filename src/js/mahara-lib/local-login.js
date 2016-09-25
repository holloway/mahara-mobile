/*jshint esnext: true */
import httpLib      from './http-lib.js';

import {parseUserConfigFromHTML} from './get-user-profile.js';

const service = "maharamobile";
const component = "module/mobileapi";
const basicLoginUrl = "module/mobileapi/json/token.php";

export default function localLogin(username, password, successCallback, errorCallback){
  var url = this.getWwwroot() + basicLoginUrl;
  
  httpLib.getAsJSON(
    url,
    {
      "username": username,
      "password": password,
      "service": service,
      "component": component,
      "clientname": "Mahara Mobile", // TODO: lang string
      "clientenv": device.platform + ', ' + device.manufacturer + ', ' + device.model,
      "clientguid": device.uuid,
    },
    (json) => {
      if (!json.token) {
        errorCallback.call(this, json, json);
      }
      this.setAccessToken(json.token);
      successCallback.call(this, json);
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
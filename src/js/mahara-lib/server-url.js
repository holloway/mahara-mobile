/*jshint esnext: true */
import httpLib      from './http-lib.js';
import {LOGIN_TYPE} from './constants.js';

export default function autoDetectServerCapabilities(wwwroot, finalSuccessCallback, finalErrorCallback){
  var infoPath = "webservice/info.php";
  httpLib.getAsJSON(
    wwwroot + infoPath,
    {},
    handleSuccess,
    handleFailure
  );

  function handleSuccess(json) {
    if (json.error) {
      // handle an error
      console.log(json.message);
      finalErrorCallback();
      return;
    }

    // Check to see if webservices & rest are enabled
    if (!json.wsenabled) {
      console.log("Webservices not enabled :(");
      finalErrorCallback();
      return;
    }

    if (!(Array.isArray(json.wsprotocols) && json.wsprotocols.includes("rest"))) {
      console.log("REST not enabled :(");
      finalErrorCallback();
      return;
    }

    if (!(Array.isArray(json.logintypes))) {
      console.log("No logintypes???");
      finalErrorCallback();
      return;
    }

    var loginTypes = [];
    if (json.logintypes.includes("basic")) {
      loginTypes.push(LOGIN_TYPE.LOCAL);
    }
    if (json.logintypes.includes("sso")) {
      loginTypes.push(LOGIN_TYPE.SINGLE_SIGN_ON);
    }

    finalSuccessCallback({loginTypes: loginTypes});
  }

  function handleFailure(){
    console.log("Failed trying to get server info");
    // TODO: Handle this.
    finalErrorCallback();
  }
}

export function getWwwroot(){
  return this.wwwroot;
}

/**
 * Updates the stored wwwroot, and checks the new wwroot for the server's capabilities,
 * so that we know whether it supports and webservices and whether to show SSO or just
 * normal login.
 */
export function updateWwwroot(url, successCallback, errorCallback){
  this.wwwroot = url;
  return this.autoDetectServerCapabilities(this.wwwroot, successCallback, errorCallback);
}

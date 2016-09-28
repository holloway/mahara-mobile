import httpLib      from './http-lib.js';
import {LOGIN_TYPE} from '../constants.js';

export default function autoDetectServerCapabilities(wwwroot, finalSuccessCallback, finalErrorCallback){
  var infoPath = "module/mobileapi/json/info.php";
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

    // Data about this server, to store
    var serverData = {
        maharaVersion: (typeof json.maharaversion === "undefined" ? null : json.maharaversion),
        siteName: (typeof json.siteName === "undefined" ? null : json.siteName),
        loginTypes: []
    };
    

    if (json.logintypes.includes("basic")) {
      serverData.loginTypes.push(LOGIN_TYPE.LOCAL);
    }
    if (json.logintypes.includes("sso")) {
      serverData.loginTypes.push(LOGIN_TYPE.SINGLE_SIGN_ON);
    }


    finalSuccessCallback(
        {
            loginTypes: serverData.loginTypes,
        }
    );
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

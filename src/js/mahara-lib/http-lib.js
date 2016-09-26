import {maharaServer} from '../state.js';

const httpLib = {
  /**
   * Raw asynchronous HTTP request. (Wrapper around XMLHttpRequest)
   * 
   * @param {string} method HTTP method to use
   * @param {object} headers List of HTTP headers to pass to XMLHttpRequest.setRequestHeader()
   * @param {string} path
   * @param {object} getParams
   * @param {string} postData
   * @param function(Event) successCallback
   * @param function(Event) errorCallback
   * @returns
   */
  raw: function(method, headers, path, getParams, postData, successCallback, errorCallback){
    var request = new XMLHttpRequest(),
        key;

    if(getParams){
      if(path.indexOf("?") === -1){
        path += "?";
      }
      for(key in getParams){
        path += (path.slice(-1) === "?" ? "" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(getParams[key]);
      }
    }
    if ("withCredentials" in request){
      request.withCredentials = true;
      request.open(method, path, true);
    } else {
      request.open(method, path);
    }
    if(headers){
      for(key in headers){
        request.setRequestHeader(key, headers[key]);
      }
    }
    request.onload = successCallback;
    request.onerror = errorCallback;
    request.send(postData);
    return request;
  },

  /**
   * Asynchronous GET request
   * 
   * @param {string} path
   * @param {object} getParams
   * @param function(Event) successCallback
   * @param function(Event) errorCallback
   * @param {object} headers
   * @returns
   */
  get: function(path, getParams, successCallback, errorCallback, headers){
    return httpLib.raw("GET", headers, path, getParams, null, successCallback, errorCallback);
  },

  /**
   * Asynchronous GET request that expects to receive a JSON-encoded response
   * 
   * @param {string} path
   * @param {object} getParams
   * @param function(Object jsonData) successCallback
   * @param function(Event, Exception, Object jsonData) errorCallback
   * @param {Object} headers
   * @returns
   */
  getAsJSON: function(path, getParams, successCallback, errorCallback, headers){
    return httpLib.get(path, getParams, httpLib.asJSON(successCallback, errorCallback), errorCallback, headers);
  },

  /**
   * Success callback function to convert JSON raw response to JSON object
   * 
   * @param {function(Object jsonData)} successCallback
   * @param {function(Event, Exception, Object jsonData)} errorCallback
   * @returns
   */
  asJSON: function(successCallback, errorCallback){
    return function asJSON(response){
      var jsonData;
      var rawText;
      if (typeof response.target !== "undefined" && typeof response.target.responseText !== "undefined") {
        rawText = response.target.responseText;
      }
      else if (typeof response.response !== "undefined") {
        rawText = response.response;
      }
      else {
        return errorCallback.call(httpLib, response, null, null);
      }
      try {
        jsonData = JSON.parse(rawText);
      } catch (e){
        return errorCallback.call(httpLib, response, e, rawText);
      }
      // When mahara knows JSON is expected in the response, 
      // and there's an error, it prints an error code and
      // message.
      //
      // The Legacy API sets "fail"
      if (jsonData.error || jsonData.fail) {
        return errorCallback.call(httpLib, response, null, jsonData);
      }
      return successCallback.call(httpLib, jsonData);
    };
  },

  /**
   * Send a POST request with application/x-www-form-urlencoded, like a form submission
   * 
   * @param {string} path
   * @param {Object} getParams
   * @param {Object} postParams
   * @param {function(Event)} successCallback
   * @param {function(Event)} errorCallback
   * @param {Object} headers
   * @returns
   */
  postText: function(path, getParams, postParams, successCallback, errorCallback, headers){
    // Can only handle key:values of text, no blobs
    var postData;

    if(postParams){
      postData = "";
      for(var key in postParams){
        postData += (postData.length === 0 ? "" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(postParams[key]);
      }
      if(!headers) headers = {};
      headers["Content-type"] = "application/x-www-form-urlencoded";
    }
    return httpLib.raw("POST", headers, path, getParams, postData, successCallback, errorCallback);
  },

  /**
   * Send a POST request that's not like a form submission(?)
   * 
   * @param {string} path
   * @param {Object} getParams
   * @param {Object} postParams
   * @param {FileEntry} fileUpload File to upload. (Currently we only support one upload per request)
   * array of FileEntry objects.
   * @param {string} filesParamName Name of the POST param with the file content.
   * @param {function(Event)} successCallback
   * @param {function(Event)} errorCallback
   * @param {Object} headers
   * @returns
   */
  postData: function(path, getParams, postParams, successCallback, errorCallback, headers, fileUpload, filesParamName){
    var formData = new FormData(),
        key,
        value;

    for(key in postParams){
      if (!postParams.hasOwnProperty(key)) {
        continue;
      }
      formData.append(key, postParams[key]);
    }

    if (fileUpload) {
      var fileURL = fileUpload.toURL();
      new FileTransfer().upload(
        fileURL,
        encodeURI(path),
        successCallback,
        errorCallback,
        {
          fileKey: filesParamName,
          fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
          //mimetype: "text/plain", Mahara will ignore what the browser says the mimetype is.
          httpMethod: "POST",
          params: postParams,
          headers: headers
        }
      );
    }
    else {
      return httpLib.raw("POST", headers, path, getParams, formData, successCallback, errorCallback);
    }
  },

  /**
   * Send a POST request and process the results into JSON
   * 
   * @param {any} path
   * @param {any} getParams
   * @param {any} postParams
   * @param {any} successCallback
   * @param {any} errorCallback
   * @param {any} headers
   * @returns
   */
  postAsJSON: function(path, getParams, postParams, successCallback, errorCallback, headers, fileUpload, filesParamName){
    return httpLib.raw("POST", null, path, getParams, JSON.stringify(postParams), httpLib.asJSON(successCallback, errorCallback), errorCallback, headers, fileUpload, filesParamName);
  },

  /**
   * Access a Mahara REST-based webservice using an auth token.
   * 
   * @param {string} wsfunction Name of the function to access
   * @param {object} wsparams
   * @param function() successCallback
   * @param function() errorCallback
   * @returns XMLHttpRequest
   */
  callWebservice(
      wsfunction,
      wsparams,
      successCallback,
      errorCallback
  ) {

    // TODO: some kind of auto-fallthrough to send you to the auth system when you need to re-auth?
    if (!maharaServer.getAccessToken()) {
      return errorCallback("Not connected to webservice yet");
    }
    
    var getparams = {
      alt:'json',
    };
    var postparams = {
      wsfunction: wsfunction,
      wstoken: maharaServer.getAccessToken(),
    };
    try {
      postparams = Object.assign(postparams, wsparams);
    } catch (e) {
      // TODO: log that wsparams was the wrong type of object?
    }

    // TODO: handle a "re-auth needed" failure?
    return httpLib.postAsJSON(
      maharaServer.getWwwroot() + 'webservice/rest/server.php',
      getparams,
      postparams,
      successCallback,
      errorCallback
    );
  }
};

export default httpLib;
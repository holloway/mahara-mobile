/*jshint esnext: true */

export default {
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
  get: function(path, getParams, successCallback, errorCallback, headers){
    return this.raw("GET", headers, path, getParams, null, successCallback, errorCallback);
  },
  getAsJSON: function(path, getParams, successCallback, errorCallback, headers){
    return this.get(path, getParams, this.asJSON(successCallback, errorCallback), errorCallback, headers);
  },
  asJSON: function(successCallback, errorCallback){
    return function asJSON(response){
      var jsonData;
      try {
        jsonData = JSON.parse(response.target.responseText);
      } catch (e){
        return errorCallback(response, e);
      }
      successCallback.call(this, jsonData, arguments);
    };
  },
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
    return this.raw("POST", headers, path, getParams, postData, successCallback, errorCallback);
  },
  postData: function(path, getParams, postParams, successCallback, errorCallback, headers){
    var formData = new FormData(),
        key,
        value;

    for(key in postParams){
      value = postParams[key];
      if(value.fileName){
        formData.append(key, value, value.fileName);
      } else {
        formData.append(key, value);
      }
    }

    return this.raw("POST", headers, path, getParams, formData, successCallback, errorCallback);
  },
};

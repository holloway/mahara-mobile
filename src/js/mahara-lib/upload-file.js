/*jshint esnext: true */
import SanitizeHTML          from 'sanitize-html';

import httpLib               from './http-lib.js';
import {dataURItoBlob}       from './util.js';
import http                  from './http-lib.js';
import {UPLOAD_HANDLER_TYPE} from './constants.js';

export default function uploadFile(fileEntry, successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      uploadPath = "/artefact/file/index.php",
      that = this,
      params = {};

  if(!protocolAndDomain) return errorCallback({error:true, noProtocolAndDomain:true, message: "No protocol or domain", fileEntry:fileEntry});

  if(!this.profile || !this.profile.sesskey || !this.sync) return errorCallback({error:true, isLoggedIn:false, message: "Not logged in."});

  params.folder = 0;
  params.files_filebrowser_foldername = "Home";
  params.files_filebrowser_uploadnumber = 2;
  params.files_filebrowser_upload = 1;
  params.sesskey = this.profile.sesskey;
  params.pieform_jssubmission = 1;
  params.pieform_jssubmission = 1;

  if(fileEntry.fileBlob){
    params["userfile[]"] = fileEntry.fileBlob;
    params["userfile[]"].filename = fileEntry.fileName;
    http.postData(protocolAndDomain + uploadPath, undefined, params, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry));
  } else if(fileEntry.dataURL){ // typically only used in browsers not in app
    params["userfile[]"] = dataURItoBlob(fileEntry.dataURL);
    params["userfile[]"].filename = fileEntry.fileName;
    http.postData(protocolAndDomain + uploadPath, undefined, params, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry));
  } else {
    // Assume Phonegap
    var options = new FileUploadOptions();
    options.fileKey  = "userfile[]"; //depends on the api
    options.fileName = fileEntry.fileName;
    options.mimeType = fileEntry.mimeType || "image/jpeg"; //not sure if it matters whether this is an image/png
    options.params = params;
    options.chunkedMode = true; // WARNING this is apparently important to send both data and files BUT it may cause bugs on Nginx
    //var headers={'Authorization':"Basic " + Base64.encode(username + ":" + password)};
    //options.headers = headers;
    var ft = new FileTransfer();
    ft.upload(fileEntry.uri, protocolAndDomain + uploadPath, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.PHONEGAP_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.PHONEGAP_UPLOADER, fileEntry), options);
  }

  function successFrom(successCallback, errorCallback, handler, fileEntry){
    return function(response){
      var responseJSON;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, data:response, fileEntry:fileEntry});
      
      parseResponseForUploads(response.target.response)

      if(response.target.response.indexOf(fileEntry.fileName) === -1) return errorCallback({error:true, uploadFailure:true, data:response, fileEntry:fileEntry});


      console.log("success", handler, response);
      // successCallback({fileEntry:fileEntry});
    };
  }

  function errorFrom(callback, handler, fileEntry){
    return function(response){
      if(!response) response = {error:true};
      response.fileEntry = fileEntry;
      console.log("error", handler, response);
      callback(response);
    };
  }

}

function parseResponseForUploads(htmlString){
  var cleanHTML = SanitizeHTML(htmlString, {
    allowedTags: ["span"],
    allowedAttributes: {
      'span': [ 'class' ]
    }
  });

  console.log(cleanHTML);


}


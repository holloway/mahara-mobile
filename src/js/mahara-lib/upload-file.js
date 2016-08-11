/*jshint esnext: true */
import httpLib               from './http-lib.js';
import {dataURItoBlob,
        trimString}          from './util.js';
import http                  from './http-lib.js';
import {UPLOAD_HANDLER_TYPE,
        DOWNLOAD_HTML_ELEMENT} from './constants.js';



export default function uploadFile(fileEntry, successCallback, errorCallback){
  var url = this.getUrl(),
      uploadPath = "/artefact/file/index.php",
      that = this,
      params = {};

  if(!url) return errorCallback({error:true, noProtocolAndDomain:true, message: "No protocol or domain", fileEntry:fileEntry});

  if(!this.profile || !this.profile.sesskey || !this.sync) return errorCallback({error:true, isLoggedIn:false, message: "Not logged in."});

  params.folder = 0;
  params.files_filebrowser_changefolder = "";
  params.files_filebrowser_foldername = "Home";
  params.files_filebrowser_uploadnumber = 1; // might need to be dynamically calculated?
  params.MAX_FILE_SIZE = 2097152;
  params.files_filebrowser_upload = "Upload";
  params.files_filebrowser_createfolder_name = "";
  params.files_filebrowser_move = "";
  params.files_filebrowser_moveto = "";
  params.files_filebrowser_edit_description = "";
  params.files_filebrowser_edit_tags = "";
  params.files_filebrowser_edit_allowcomments = "on";
  params.files_filebrowser_edit_title = fileEntry.fileName;
  params.sesskey = this.profile.sesskey;
  params.pieform_files = "";
  params.pieform_jssubmission = 1;
  params.pieform_jssubmission = 1;

  if(fileEntry.fileBlob){
    params["userfile[]"] = fileEntry.fileBlob;
    params["userfile[]"].fileName = fileEntry.fileName;
    http.postData(url + uploadPath, undefined, params, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry));
  } else if(fileEntry.dataURL){ // typically only used in browsers not in app
    params["userfile[]"] = dataURItoBlob(fileEntry.dataURL);
    params["userfile[]"].fileName = fileEntry.fileName;
    http.postData(url + uploadPath, undefined, params, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.XHR_UPLOADER, fileEntry));
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
    ft.upload(fileEntry.uri, url + uploadPath, successFrom(successCallback, errorCallback, UPLOAD_HANDLER_TYPE.PHONEGAP_UPLOADER, fileEntry), errorFrom(errorCallback, UPLOAD_HANDLER_TYPE.PHONEGAP_UPLOADER, fileEntry), options);
  }

  function successFrom(successCallback, errorCallback, handler, fileEntry){
    return function(response){
      var responseJSON,
          uploads;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, data:response, fileEntry:fileEntry});

      if(response.target.response.indexOf(fileEntry.fileName) === -1) return errorCallback({error:true, uploadFailure:true, data:response, fileEntry:fileEntry});

      successCallback({fileEntry:fileEntry});
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


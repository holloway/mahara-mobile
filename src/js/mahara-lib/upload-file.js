/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function uploadFile(fileEntry, successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      uploadPath = "/artefact/file/index.php",
      that = this;

  if(!protocolAndDomain) return errorCallback({error:true, noProtocolAndDomain:true, message: "No protocol or domain", fileEntry:fileEntry});

  if(!this.profile || !this.profile.sesskey || !this.sync) return errorCallback({error:true, isLoggedIn:false, message: "Not logged in."});

  //var username='your_user';
  //var password='your_pwd';

  //params.your_param_name = "something";  //you can send additional info with the file

  console.log("PHONEGAP", FileUploadOptions, FileTransfer, window.FileUploadOptions, window.FileTransfer);

  if(FileUploadOptions && FileTransfer){ // if Phonegap
    //var headers={'Authorization':"Basic " + Base64.encode(username + ":" + password)};
    //options.headers = headers;
    var options = new FileUploadOptions(),
        params = {};
    params.folder = 0;
    params.files_filebrowser_foldername = "Home";
    params.files_filebrowser_uploadnumber = 2;
    params.files_filebrowser_upload = 1;
    params.sesskey = this.profile.sesskey;
    params.pieform_jssubmission = 1;
    params.pieform_jssubmission = 1;
    options.fileKey  = "userfile[]"; //depends on the api
    options.fileName = fileEntry.filename;
    options.mimeType = "image/jpeg"; //not sure if it matters whether this is an image/png
    options.params = params;
    options.chunkedMode = true; //this is important to send both data and files though apparently may cause bugs on Nginx
    var ft = new FileTransfer();
    ft.upload(fileEntry.uri, protocolAndDomain + uploadPath, successFrom(successCallback, errorCallback), errorFrom(errorCallback), options);
  } else {
    console.log("No phonegap libraries available.");
  }


  function successFrom(successCallback, errorCallback){
    return function(response){
      var responseJSON;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, data:response, fileEntry:fileEntry});

      successCallback({fileEntry:fileEntry});
    };
  }

  function errorFrom(callback){
    return function(response){
      if(!response) response = {error:true};
      response.fileEntry = fileEntry;
      callback(response);
    };
  }

}



/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function uploadJournal(journalEntry, successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      uploadPath = "/api/mobile/upload.php",
      that = this;

  if(!protocolAndDomain) return errorCallback({error:true, noProtocolAndDomain:true, message: "No protocol or domain", journalEntry:journalEntry});

  this.setMobileUploadToken(this.generateUploadToken(), function(uploadToken, userData){
    var postData = {
      title:       journalEntry.title,
      description: journalEntry.body,
      token:       uploadToken,
      username:    userData.username,
      foldername:  ''
    };
    that.getSyncData(function(syncData){
      if(!syncData || !syncData.sync || !syncData.sync.blogs || syncData.sync.blogs.length === 0) return errorCallback({error:true, noBlogIndex:true, message:"No blog index found in syncData.", data:syncData, journalEntry:journalEntry});
      postData.blog = parseInt(syncData.sync.blogs[0].id, 10);
      httpLib.post(protocolAndDomain + uploadPath, undefined, postData, successFrom(successCallback, errorCallback), failureFrom(errorCallback));
    }, function(response){
      if(!response) response = {error:true};
      response.journalEntry = journalEntry;
      errorCallback(response);
    });
  }, function(err){
    errorCallback({error:true, message:err, journalEntry:journalEntry});
  });

  function successFrom(successCallback, errorCallback){
    return function(response){
      var responseJSON;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, errorResponse:response, journalEntry:journalEntry});

      try {
        responseJSON = JSON.parse(response.target.response);
      } catch(e){
      }

      if(!responseJSON) return errorCallback({error:true, message: "Invalid JSON: " + response.target.response, journalEntry:journalEntry});
      if(responseJSON.fail) return errorCallback({error:true, message: responseJSON.fail, obj:responseJSON, journalEntry:journalEntry});
      if(responseJSON.error) return errorCallback({error:true, message: responseJSON.message, obj:responseJSON, journalEntry:journalEntry});

      successCallback({journalEntry:journalEntry});
    };
  }

  function failureFrom(callback){
    return function(response){
      if(!response) response = {error:true};
      response.journalEntry = journalEntry;
      callback(response);
    };
  }

}
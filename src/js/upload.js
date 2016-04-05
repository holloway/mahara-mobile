/*jshint esnext: true */

import StateStore, {maharaServer}              from './state.js';
import {REATTEMPT_UPLOADS_AFTER_MILLISECONDS,
        PENDING,
        JOURNAL}                               from './constants.js';

export default function uploadNextItem(state){
  // This recursively uploads all items
  var guid = state.uploadGuid,
      now = Date.now(),
      item,
      i;

  for(i = 0; i < state.pendingUploads.length; i++){
    if(state.pendingUploads[i].guid === guid){
      item = state.pendingUploads[i];
    }
  }

  if(!item){
    console.log("Couldn't find guid to upload. Cancelling uploads.");
    StateStore.dispatch({type:JOURNAL.STOP_UPLOADS});
    return;
  }

  if(now - item.startedUploadAt < REATTEMPT_UPLOADS_AFTER_MILLISECONDS){
    console.log("This is normal, don't worry, but we won't attempt to upload again for " + (((REATTEMPT_UPLOADS_AFTER_MILLISECONDS + now) - item.startedUploadAt) / 1000) + " seconds.", item);
    return; // then we're probably already processing it
  }

  StateStore.dispatch({type:PENDING.STARTED_UPLOAD_AT, guid:guid, startedUploadAt:now});

  if(item.type === JOURNAL.TYPE){
    uploadJournal(item);
  } else {
    console.log("Unrecognised upload type", item);
    StateStore.dispatch({type:JOURNAL.STOP_UPLOADS});
  }
}

function uploadJournal(journalEntry){
  maharaServer.uploadJournal(journalEntry, function(response){
      StateStore.dispatch({type:PENDING.DELETE, guid:response.journalEntry.guid});
      StateStore.dispatch({type:PENDING.UPLOAD_NEXT});
    }, function(response){
      var journalEntry = response.journalEntry;
      StateStore.dispatch({type:PENDING.STOP_UPLOADS});
      if(response && response.error){
        if(response.hasOwnProperty("isLoggedIn")){
          alertify.alert(that.gettext("cant_sync_session_expired"), function (e, str) {
            Router.navigate(PAGE_URL.LOGIN_TYPE);
          });
        } else if(response.hasOwnProperty('sesskeyError')){
          alertify.alert(that.gettext("sesskey_scrape_error"));
        } else if(response.hasOwnProperty("message")){
          alertify.alert(that.gettext("server_response_prefix") + "\n" + response.message);
        }
        return;
      }
      console.log("There was a problem uploading.", arguments);
    });
}

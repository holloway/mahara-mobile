/*jshint esnext: true */
import React from 'react';

import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import {STORAGE,
        PAGE_URL,
        JOURNAL}           from '../../constants.js';

class Sync extends MaharaBaseComponent {
  constructor(){
    super();
    this.uploadNextJournal = this.uploadNextJournal.bind(this);
  }
  render() {
    console.log("pendingUploads", this.props.pendingUploads);

    return <section>
      <h1>Sync</h1>
      <p>...</p>
      <button onClick={this.uploadNextJournal}>upload journal</button>
    </section>;
  }
  uploadNextJournal(){
    var journalEntry,
        that = this,
        dontReattemptUploadWithinMilliseconds = 1000 * 60 * 10;

    if(!this.props.pendingUploads || this.props.pendingUploads.length === 0) return;

    journalEntry = this.props.pendingUploads[0];

    if(journalEntry.uploadBeganAt && journalEntry.uploadBeganAt > Date.now() - dontReattemptUploadWithinMilliseconds){
      console.log("Upload was too recent to attempt again");
      return;
    }

    journalEntry.uploadBeganAt = Date.now();

    maharaServer.uploadJournal(journalEntry, function(response){
      var journalEntry = response.journalEntry;

      journalEntry.uploadBeganAt = undefined;
      StateStore.dispatch({type:JOURNAL.REMOVE_ENTRY, journalGuid:journalEntry.guid});
    }, function(response){
      console.log("error response", response);

      var journalEntry = response.journalEntry;

      journalEntry.uploadBeganAt = undefined;
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
      console.log("callback afterwards", arguments);
    });
  }
}

export default Sync;

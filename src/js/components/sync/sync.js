/*jshint esnext: true */
import React from 'react';

import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore          from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';
import maharaServer        from '../../mahara-lib/mahara-server.js';

class Sync extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Sync</h1>
      <p>...</p>
      <button onClick={this.sync}>upload journal</button>
    </section>;
  }
  sync = () => {
    var uploadToken,
        that = this;

    if(maharaServer.uploadToken){
      this.uploadJournal();
    } else {
      uploadToken = maharaServer.generateUploadToken();
      maharaServer.setMobileUploadToken(uploadToken, function(wasUpdated){
        if(wasUpdated){
          StateStore.dispatch({type:STORAGE.SET_UPLOAD_TOKEN, uploadToken:uploadToken});
          that.uploadJournal();
        } else {
          alertify.okBtn(that.gettext("alert_ok_button"));
          alertify.alert(that.gettext("cant_set_upload_token_error"));
        }
      });
    }
  }
  uploadJournal = () => {
    var that = this;

    maharaServer.uploadJournal("my title", "my body", undefined, function(response){
      if(response && response.error){
        if(response.hasOwnProperty("isLoggedIn")){
          alertify.okBtn(that.gettext("alert_ok_button"));
          alertify.alert(that.gettext("cant_sync_session_expired"), function (e, str) {
            Router.navigate(PAGE_URL.LOGIN_TYPE);
          });
        } else if(response.hasOwnProperty('sesskeyError')){
          alertify.okBtn(that.gettext("alert_ok_button"));
          alertify.alert(that.gettext("sesskey_scrape_error"));
        } else if(response.hasOwnProperty("message")){
          alertify.okBtn(that.gettext("alert_ok_button"));
          alertify.alert(that.gettext("server_response_prefix") + "\n" + response.message);
        }
        return;
      }
      console.log("callback afterwards");
    });
  }
}

export default Sync;

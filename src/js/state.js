/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import Storage         from './storage.js';
import MaharaServer    from './mahara-lib/mahara-server.js';
import {arrayRemoveIf} from './util.js';
import {PAGE,
        LOGIN,
        STORAGE,
        JOURNAL,
        FILE_ENTRY,
        PENDING}       from './constants.js';

const maharaServerInstance = new MaharaServer();

function MaharaState(state, action) {
  if (state === undefined) { //Initial state upon page load
    state = Storage.state.get();
    if(!state){ // if there was no saved state
      state = {lang:['en']};
      action.type = PAGE.SERVER;
    } else if(state.server) {
      maharaServerInstance.loadState(state.server);
    }
  }

  state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

  if(window.isCordova !== undefined){   // ok, technically this is a side-effect (a big no no)...
    state.isCordova = window.isCordova; // but it doesn't change during the app lifecycle (once loaded)
  }                                     // loading so it's harmless

  switch (action.type) {
    case PAGE.SERVER:
    case PAGE.LOGIN_TYPE:
    case PAGE.LOGIN:
    case PAGE.SSO:
    case PAGE.USER:
    case PAGE.ADD:
    case PAGE.ADD_JOURNAL_ENTRY:
    case PAGE.PENDING:
    case PAGE.SYNC:
    //case PAGE.EDIT_JOURNAL_ENTRY:
      state.page = action.type;
      break;
    case STORAGE.SET_SERVER_URL:
      state.server = state.server || {};
      state.server.url = action.serverUrl;
      state.startAutoDetectingProtocolAndLoginMethod = true;
      break;
    case STORAGE.SET_SERVER_DOMAIN:
      state.server = state.server || {};
      state.server.domain = action.domain;
      maharaServerInstance.domain = action.domain;
      break;
    case STORAGE.STOP_AUTODETECTING:
      state.startAutoDetectingProtocolAndLoginMethod = undefined;
      break;
    case STORAGE.AUTODETECTED_SERVER:
      state.server = state.server || {};
      state.server.loginTypes = action.loginTypes;
      state.server.protocol = action.protocol;
      state.server.ssoUrl = action.ssoUrl;
      maharaServerInstance.loginTypes = action.loginTypes;
      maharaServerInstance.protocol = action.protocol;
      maharaServerInstance.ssoUrl = action.ssoUrl;
      break;
    case STORAGE.SET_SERVER_LOGIN_TYPES:
      state.server = state.server || {};
      state.server.loginTypes = action.loginTypes;
      state.server.ssoUrl     = action.ssoUrl;
      state.server.protocol   = action.protocol;
      break;
    case STORAGE.SET_SERVER_CHOSEN_LOGIN_TYPE:
      state.server = state.server || {};
      state.server.loginType = action.loginType;
      maharaServerInstance.loginType = action.loginType;
      break;
    case STORAGE.SET_UPLOAD_TOKEN:
      if(console.trace) console.trace();
      console.log("Should not set upload token in state. Check previous trace to remove offending code.");
      break;
    case LOGIN.SSO_AVAILABILITY_RESET:
      state.server = state.server || {};
      state.server.ssoAvailable = undefined;
      break;
    case LOGIN.SSO_IS_AVAILABLE:
      state.server = state.server || {};
      state.server.ssoAvailable = true;
      break;
    case LOGIN.SSO_NOT_AVAILABLE:
      state.server = state.server || {};
      state.server.ssoAvailable = false;
      break;
    case STORAGE.SET_USER_PROFILE:
      state.server = state.server || {};
      state.server.profile = action.profile;
      maharaServerInstance.profile = action.profile;
      break;
    case STORAGE.SET_USER_SYNC_DATA:
      state.server = state.server || {};
      state.server.sync = action.sync;
      maharaServerInstance.sync = action.sync;
      break;
    case JOURNAL.ADD_ENTRY:
      state.pendingUploads = state.pendingUploads || [];
      state.pendingUploads.push(action.journalEntry);
      break;
    case FILE_ENTRY.ADD_ENTRY:
      state.pendingUploads = state.pendingUploads || [];
      if(window.localStorage && action.fileEntry.dataURL){
        // we store it seperately because it's a lot of data (often megabytes
        // of text), and every subsequent change to the MaharaState is
        // serialized to localStorage, so even a page change would mean
        // serializing this data yet again. This can cause 100ms+ stalls.
        // This means we only serialize it once, and read it once, and then
        // delete it.
        window.localStorage.setItem(action.fileEntry.guid, action.fileEntry.dataURL);
        action.fileEntry.dataURL = true;
      }
      state.pendingUploads.push(action.fileEntry);
      break;
    case PENDING.STARTED_UPLOAD_AT:
      state.pendingUploads = state.pendingUploads || [];
      var foundItem = false;
      state.pendingUploads.map(function(item, index){
        if(item.guid && item.guid === action.guid){
          foundItem = true;
          item.startedUploadAt = action.startedUploadAt;
        }
      });
      if(!foundItem) {
        var msg = "Fatal problem finding guid=" + action.guid;
        alert(msg);
        throw msg;
      }
      break;
    case PENDING.UPLOAD_NEXT:
      if(state.pendingUploads && state.pendingUploads.length){
        state.uploadGuid = state.pendingUploads[0].guid;
      } else { // else there's nothing to process
        state.uploadGuid = undefined;
      }
      break;
    case PENDING.STOP_UPLOADS:
      state.uploadGuid = undefined;
      if(state.pendingUploads && state.pendingUploads.length){
        for(var i = 0; i < state.pendingUploads.length; i++){
          state.startedUploadAt = undefined;
        }
      }
      break;
    case PENDING.DELETE_ALL:
      state.pendingUploads = undefined;
      break;
    case PENDING.DELETE:
      state.pendingUploads = state.pendingUploads || [];
      var pendingUploadsBefore = state.pendingUploads.length;
      arrayRemoveIf.bind(state.pendingUploads)(function(item, index){
        if(item.guid && item.guid === action.guid) {
          if(window.localStorage && item.dataURL === true){
            window.localStorage.removeItem(action.guid);
          }
          return true;
        }
        return false;
      });
      if(pendingUploadsBefore === state.pendingUploads.length){
        console.log("Warning not able to remove item ", action.guid, state.pendingUploads);
      }
      break;
    case LOGIN.AFTER_LOGIN_GET_PROFILE:
      state.getProfile = true;
      break;
    case LOGIN.STOP_GETTING_PROFILE:
      state.getProfile = undefined;
      break;
  }

  Storage.state.set(state);

  return state;
}

function afterUpdateProtocolAndLoginMethods(){
  console.log("maharaServerInstance.protocol:", maharaServerInstance);
  StateStore.dispatch({
    type:       STORAGE.SET_SERVER_LOGIN_TYPES,
    protocol:   maharaServerInstance.protocol,
    loginTypes: maharaServerInstance.loginTypes,
    ssoUrl:     maharaServerInstance.ssoUrl
  });
}

const StateStore = createStore(MaharaState);

export default StateStore;

export const maharaServer = maharaServerInstance;

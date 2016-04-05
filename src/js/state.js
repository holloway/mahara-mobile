/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import Storage         from './storage.js';
import MaharaServer    from './mahara-lib/mahara-server.js';
import {arrayRemoveIf} from './util.js';
import {PAGE,
       STORAGE,
       JOURNAL,
       PENDING,
       LIBRARY}        from './constants.js';

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

  switch (action.type) {
    case PAGE.SERVER:
    case PAGE.LOGIN_TYPE:
    case PAGE.LOGIN:
    case PAGE.SSO:
    case PAGE.USER:
    case PAGE.ADD:
    case PAGE.ADD_LIBRARY:
    case PAGE.ADD_JOURNAL_ENTRY:
    //case PAGE.EDIT_LIBRARY:
    //case PAGE.EDIT_JOURNAL_ENTRY:
    case PAGE.PENDING:
    case PAGE.SYNC:
      state.page = action.type;
      break;
    case STORAGE.SET_SERVER_URL:
      state.server = state.server || {};
      state.server.domain = maharaServer.setUrl(action.serverUrl, afterUpdateProtocolAndLoginMethods); // Side effects... ugh
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
      break;
    case STORAGE.SET_UPLOAD_TOKEN:
      if(console.trace) console.trace();
      console.log("Should not set upload token in state. Check previous trace to remove offending code.");
      break;
    case STORAGE.SET_SERVER_SESSION:
      state.server = state.server || {};
      state.server.token = action.token;
      state.server.user  = action.user;
      break;
    case JOURNAL.ADD_ENTRY:
      state.pendingUploads = state.pendingUploads || [];
      state.pendingUploads.push(action.journalEntry);
      break;
    case PENDING.DELETE:
      state.pendingUploads = state.pendingUploads || [];
      var pendingUploadsBefore = state.pendingUploads.length;
      arrayRemoveIf.bind(state.pendingUploads)(function(item, index){
        return (item.guid && item.guid === action.guid);
      });
      if(pendingUploadsBefore === state.pendingUploads.length){
        console.log("Warning not able to remove item ", action.guid);
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
        for(i = 0; i < state.pendingUploads.length; i++){
          state.startedUploadAt = undefined;
        }
      }
      break;
    case LIBRARY.ADD_ENTRY:
      state.pendingUploads = state.pendingUploads || [];
      state.pendingUploads.push(action.libraryItem);
      break;
    case PENDING.DELETE_ALL:
      state.pendingUploads = undefined;
      break;
    case PENDING.DELETE:
      var pendingUpload;
      if(!action.guid) console.log("Expected a guid with ", PENDING.DELETE);
      for(var i = 0; i < state.pendingUploads.length; i++){
        pendingUpload = state.pendingUploads[i];
        if(pendingUpload.guid !== undefined && pendingUpload.guid === action.guid){
          state.pendingUploads.splice(i, 1);
        }
      }
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
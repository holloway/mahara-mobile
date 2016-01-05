/*jshint esnext: true */
import {createStore }                    from 'redux';
import {Provider}                        from 'react-redux';
import Storage                           from './storage.js';
import maharaServer                      from './mahara-lib/mahara-server.js';
import {PAGE, STORAGE, JOURNAL, PENDING, LIBRARY} from './constants.js';

function MaharaState(state, action) {
  if (state === undefined) { //Initial state upon page load
    state = Storage.state.get();
    if(!state){ // if there was no saved state
      state = {lang:['en']};
      action.type = PAGE.SERVER;
    } else if(state.server) {
      maharaServer.restore(state.server);
    }
  }

  state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

  switch (action.type) {
    case PAGE.SERVER:
    case PAGE.LOGIN:
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
      state.server.url = action.serverUrl;
      break;
    case STORAGE.SET_SERVER_LOGIN_TYPE:
      state.server = state.server || {};
      state.server.loginType = action.loginType;
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

const StateStore = createStore(MaharaState);

export default StateStore;

/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import Storage         from './storage.js';
import MaharaServer    from './mahara-lib/mahara-server.js';
import {arrayRemoveIf} from './util.js';
import {PAGE,
        LOGIN,
        LOGIN_TYPE,
        STORAGE,
        JOURNAL,
        FILE_ENTRY,
        PENDING}       from './constants.js';

const maharaServerInstance = new MaharaServer();

const initialState = {
    page: PAGE.SERVER,
    server: {
        wwwroot: null,
        wstoken: null,
        loginTypes: [LOGIN_TYPE.LOCAL],
        siteName: null,
        maharaVersion: null,
        profile: {
            'id': null, // User's Mahara ID number
            'myname': null, // User's Display name
            'username': null, // User's username
            'quota': null, // User's storage quota on the server (in bytes)
            'quotaused': null, // Quota used on server
            icon: null, // FileEntry.toURI() of image to display
        },
        sync: {
            blogs: [],
            folders: [],
            notifications: [],
            tags: []
        }
    },
    pendingUploads: []
};

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
    case PAGE.ADD_JOURNAL_ENTRY:
    case PAGE.PENDING:
    case PAGE.SYNC:
    //case PAGE.EDIT_JOURNAL_ENTRY:
      state.page = action.type;
      break;
    case STORAGE.SET_SERVER_URL:
      state.server = state.server || {};
      maharaServerInstance.wwwroot = state.server.wwwroot = action.serverUrl;
      state.startAutoDetectingProtocolAndLoginMethod = true;
      break;
    case STORAGE.STOP_AUTODETECTING:
      state.startAutoDetectingProtocolAndLoginMethod = undefined;
      break;
    case STORAGE.AUTODETECTED_SERVER:
      state.server = state.server || {};
      maharaServerInstance.loginTypes = state.server.loginTypes = action.server.loginTypes;
      maharaServerInstance.siteName = state.server.siteName = action.server.siteName;
      maharaServerInstance.maharaVersion = state.server.maharaVersion = action.server.maharaVersion;
      break;
    case STORAGE.SET_USER_PROFILE_ICON:
      state.server = state.server || {};
      state.server.profile = state.server.profile || {};
      state.server.profile.icon = action.icon;
      break;
    case STORAGE.SET_USER_SYNC_DATA:
      state.server = state.server || {};
      maharaServerInstance.sync.blogs = state.server.sync.blogs = action.sync.blogs;
      maharaServerInstance.sync.folders = state.server.sync.folders = state.folders;
      maharaServerInstance.sync.notifications = state.server.sync.notifications = action.sync.notifications;
      maharaServerInstance.tags = state.server.sync.tags = action.sync.tags;
      maharaServerInstance.profile = state.server.profile = action.sync.userprofile;
      maharaServerInstance.profile.icondata = state.server.profile.icondata = action.sync.userprofileicon;
      state.needToDownloadIcon = true;
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
      maharaServerInstance.wstoken = state.server.wstoken = action.wstoken;
      break;
    case LOGIN.STOP_GETTING_PROFILE:
      state.getProfile = undefined;
      break;
  }

  Storage.state.set(state);

  return state;
}

const StateStore = createStore(MaharaState);

export default StateStore;

export const maharaServer = maharaServerInstance;

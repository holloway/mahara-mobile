/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import {PAGE, STORAGE} from './constants.js';
import Storage         from './storage.js';

function MaharaState(state, action) {
  if (state === undefined) { //initial state
    state = {lang: ['en'], serverUrl: Storage.serverUrl.get()};
    action.type = PAGE.SERVER;
  }
  if(action.serverUrl){
    state.serverUrl = action.serverUrl;
  }

  state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

  switch (action.type) {
    case PAGE.SERVER:
    case PAGE.LOGIN:
    case PAGE.USER:
    case PAGE.ADD:
    case PAGE.PENDING:
    case PAGE.SYNC:
      state.page = action.type;
      break;
    case STORAGE.SET_SERVER_URL:
      Storage.serverUrl.set(action.serverUrl);
      break;
  }
  return state;
}

const StateStore = createStore(MaharaState);

export default StateStore;

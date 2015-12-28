/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import {PAGE, STORAGE} from './constants.js';
import Storage         from './storage.js';

function MaharaState(state, action) {
  if (state === undefined) { //Initial state upon page load
    state = Storage.state.get();
    if(!state){ // if there was no saved state
      state = {lang:['en']};
      action.type = PAGE.SERVER;
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
    case PAGE.PENDING:
    case PAGE.SYNC:
      state.page = action.type;
      break;
    case STORAGE.SET_SERVER_URL:
      Storage.serverUrl.set(action.serverUrl);
      break;
    case STORAGE.ADD_JOURNAL_ENTRY_ACTION:
      state.pendingUploads = state.pendingUploads || [];
      state.pendingUploads.push(action.journalEntry);
      break;
    case STORAGE.ADD_LIBRARY_ACTION:
      state.pendingUploads = state.pendingUploads || [];
      state.pendingUploads.push(action.libraryItem);
      break;
  }

  Storage.state.set(state);

  return state;
}

const StateStore = createStore(MaharaState);

export default StateStore;

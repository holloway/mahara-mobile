/*jshint esnext: true */
import {PAGES}          from './constants.js';

function MaharaState(state, action) {
  if (state === undefined) { //initial state
    return {
      lang: ['en'],
      page: PAGES.SERVER
    };
  }
  console.log(action.type);
  state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

  switch (action.type) {
    case 'PAGE_USER':
      state.page = PAGES.USER;
      break;
    case 'PAGE_ADD':
      state.page = PAGES.ADD;
      break;
    case 'PAGE_PENDING':
      state.page = PAGES.PENDING;
      break;
    case 'PAGE_SYNC':
      state.page = PAGES.SYNC;
      break;
    case 'PAGE_NONE':
      state.page = PAGES.NONE;
      break;
  }
  return state;
}

export default MaharaState;

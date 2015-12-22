/*jshint esnext: true */

function MaharaState(state, action) {
  if (state === undefined) { //initial state
    return {
      lang: ['en'],
      menu: 'User'
    };
  }
  state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

  switch (action.type) {
    case 'MENU_USER':
      state.menu = 'User';
      break;
    case 'MENU_ADD':
      state.menu = 'Add';
      break;
    case 'MENU_PENDING':
      state.menu = 'Pending';
      break;
    case 'MENU_SYNC':
      state.menu = 'Sync';
      break;
  }
  return state;
}

export default MaharaState;

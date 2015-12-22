/*jshint esnext: true */

function MaharaState(state, action) {
  if (state === undefined) { //initial state
    return {
      menu: 'User'
    };
  }

  switch (action.type) {
    case 'MENU_USER':
      return {menu:'User'};
    case 'MENU_ADD':
      return {menu:'Add'};
    case 'MENU_PENDING':
      return {menu:'Pending'};
    case 'MENU_SYNC':
      return {menu:'Sync'};
    default:
      return state;
  }
}

export default MaharaState;

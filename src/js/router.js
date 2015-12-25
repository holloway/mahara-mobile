/*jshint esnext: true */
import StateStore                from './state.js';
import Grapnel                   from 'grapnel';
import {PAGE, STORAGE, PAGE_URL} from './constants.js';

var router = new Grapnel({pushState:false});

router.get(PAGE_URL.USER, function(req){
  StateStore.dispatch({type:PAGE.USER});
});

router.get(PAGE_URL.ADD, function(req){
  StateStore.dispatch({type:PAGE.ADD});
});

router.get(PAGE_URL.PENDING, function(req){
  StateStore.dispatch({type:PAGE.PENDING});
});

router.get(PAGE_URL.SYNC, function(req){
  StateStore.dispatch({type:PAGE.SYNC});
});

router.get(PAGE_URL.SERVER, function(req){
  StateStore.dispatch({type:PAGE.SERVER});
});

router.get(PAGE_URL.LOGIN, function(req){
  StateStore.dispatch({type:PAGE.LOGIN});
});

export default router;

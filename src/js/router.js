/*jshint esnext: true */
import Grapnel          from 'grapnel';
import StateStore       from './state.js';
import {PAGE, PAGE_URL} from './constants.js';

var router = new Grapnel({pushState:false});

(function(){
  function generateDispatcher(PAGE_ID){
    return function(){
      StateStore.dispatch({type:PAGE[PAGE_ID]});
    };
  }

  for(var PAGE_ID in PAGE_URL){
    if(PAGE_URL.hasOwnProperty(PAGE_ID)){
      router.get(PAGE_URL[PAGE_ID], generateDispatcher(PAGE_ID));
    }
  }
}());

export default router;

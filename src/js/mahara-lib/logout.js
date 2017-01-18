/*jshint esnext: true */
import httpLib      from './http-lib.js';
import StateStore   from '../state.js';
import { LOGIN }    from '../constants.js';

export default function logOut(successCallback, errorCallback){
    // TODO: send logout request to the server ...
    StateStore.dispatch( { type: LOGIN.LOGOUT });

    successCallback(false);
}

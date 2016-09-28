/*jshint esnext: true */
import httpLib from './http-lib.js';
import {LOGIN_TYPE} from '../constants.js';
import JSON5 from 'json5';

export default function getUserProfile(successCallback, errorCallback){
  httpLib.callWebservice(
    'module_mobileapi_get_user_profile',
    null,
    successCallback,
    errorCallback
  );
}

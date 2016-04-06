/*jshint esnext: true */

// We have our own copies of constants.js because this mahara-lib directory
// is supposed to be standalone.

export const LOGIN_TYPE = {
  LOCAL          : "LOGIN_LOCAL", //NOTE: When this library is used in MaharaMobile the value must be identical values to constants of ../constants.js too
  SINGLE_SIGN_ON : "LOGIN_SINGLE_SIGN_ON" //NOTE: When this library is used in MaharaMobile the value must be identical values to constants of ../constants.js too
};

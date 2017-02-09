import httpLib from './http-lib.js';
const wsfunction = "module_mobileapi_get_user_profile";

// Check whether a token that a user just manually entered, is
// a valid token.
export default function verifyManualToken(successFn, failFn) {
    // We'll just call the "get user profile" function. And if it returns
    // valid-looking data, it means the profile is correct.
    this.refreshUserProfile(successFn, failFn);
}
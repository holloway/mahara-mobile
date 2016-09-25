/*jshint esnext: true */

export const PAGE = {
  SERVER:       "SERVER",
  LOGIN_TYPE:   "LOGIN_TYPE",
  LOGIN:        "LOGIN",
  SSO:          "SSO",
  USER:         "USER",
  ADD:          "ADD",
  PENDING:      "PENDING",
  EDIT_JOURNAL_ENTRY: "EDIT_JOURNAL_ENTRY",
  ADD_JOURNAL_ENTRY:  "ADD_JOURNAL_ENTRY",
};

export var PAGE_CLASSNAME = {};
for(var PAGE_ID in PAGE){
  if(PAGE.hasOwnProperty(PAGE_ID)){
    PAGE_CLASSNAME[PAGE_ID] = "PAGE_" + PAGE_ID;
  }
}

export var PAGE_URL = {};
PAGE_URL[PAGE.SERVER]             = "";
PAGE_URL[PAGE.LOGIN_TYPE]         = "/LoginType";
PAGE_URL[PAGE.LOGIN]              = "/Login";
PAGE_URL[PAGE.SSO]                = "/SSO";
PAGE_URL[PAGE.USER]               = "/User";
PAGE_URL[PAGE.ADD]                = "/Add";
PAGE_URL[PAGE.PENDING]            = "/Pending";
PAGE_URL[PAGE.ADD_JOURNAL_ENTRY]  = "/Add/JournalEntry";
PAGE_URL[PAGE.EDIT_JOURNAL_ENTRY] = "/Add/JournalEntry/*";

export const STORAGE = {
  STATE_STORAGE_KEY:            "MaharaMobile",
  SET_SERVER_URL:               "STORAGE_SET_SERVER_URL",
  SET_SERVER_CHOSEN_LOGIN_TYPE: "SET_SERVER_CHOSEN_LOGIN_TYPE",
  SET_UPLOAD_TOKEN:             "SET_UPLOAD_TOKEN",
  SET_USER_PROFILE:             "SET_USER_PROFILE",
  SET_USER_PROFILE_ICON:        "SET_USER_PROFILE_ICON",
  SET_USER_SYNC_DATA:           "SET_USER_SYNC_DATA",
  STOP_AUTODETECTING:           "STORAGE_STOP_DETECTING_PROTOCOL_AND_METHOD",
  AUTODETECTED_SERVER:          "STORAGE_AUTODETECTED_SERVER",
};

export const JOURNAL = {
  TYPE:      "JOURNAL_TYPE",
  ADD_ENTRY: "JOURNAL_ADD_ENTRY",
};

export const FILE_ENTRY = {
  TYPE:      "FILE_ENTRY_TYPE",
  ADD_ENTRY: "FILE_ENTRY_ADD_ENTRY",
};

export const PENDING = {
  DELETE_ALL:        "PENDING_DELETE_ALL",
  DELETE:            "PENDING_DELETE_BY_GUID",
  UPLOAD_NEXT:       "PENDING_UPLOAD_NEXT",
  STARTED_UPLOAD_AT: "PENDING_STARTED_UPLOAD_AT",
  STOP_UPLOADS:      "PENDING_STOP_UPLOADS"
};

export const LOGIN_TYPE = {
  LOCAL:          "LOGIN_LOCAL", //NOTE: the value must be identical values to constants of maraha-lib/constants.js too
  SINGLE_SIGN_ON: "LOGIN_SINGLE_SIGN_ON", //NOTE: the value must be identical values to constants of maraha-lib/constants.js too
};

export const LOGIN = {
  AFTER_LOGIN_GET_PROFILE: "LOGIN_AFTER_LOGIN_GET_PROFILE",
  STOP_GETTING_PROFILE:    "LOGIN_STOP_GETTING_PROFILE",
  SSO_IS_AVAILABLE:        "SSO_IS_AVAILABLE",
  SSO_NOT_AVAILABLE:       "SSO_NOT_AVAILABLE",
  SSO_AVAILABILITY_RESET:  "SSO_AVAILABILITY_RESET",
};

export const REATTEMPT_UPLOADS_AFTER_MILLISECONDS = 100; //5 * 60 * 1000;

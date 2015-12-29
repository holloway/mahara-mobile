/*jshint esnext: true */

export const PAGE = {
  SERVER:  "SERVER",
  LOGIN:   "LOGIN",
  USER:    "USER",
  ADD:     "ADD",
  PENDING: "PENDING",
  SYNC:    "SYNC",
  ADD_LIBRARY: "ADD_LIBRARY",
  ADD_JOURNAL_ENTRY: "ADD_JOURNAL_ENTRY"
};

export var PAGE_CLASSNAME = {};
for(var PAGE_ID in PAGE){
  if(PAGE.hasOwnProperty(PAGE_ID)){
    PAGE_CLASSNAME[PAGE_ID] = "PAGE_" + PAGE_ID;
  }
}

export var PAGE_URL = {};
PAGE_URL[PAGE.SERVER]            = "";
PAGE_URL[PAGE.LOGIN]             = "/Login";
PAGE_URL[PAGE.USER]              = "/User";
PAGE_URL[PAGE.ADD]               = "/Add";
PAGE_URL[PAGE.PENDING]           = "/Pending";
PAGE_URL[PAGE.SYNC]              = "/Sync";
PAGE_URL[PAGE.ADD_LIBRARY]       = "/Add/Library";
PAGE_URL[PAGE.ADD_JOURNAL_ENTRY] = "/Add/JournalEntry";

export const STORAGE = {
  STATE_STORAGE_KEY:  "MaharaState",
  SET_SERVER_URL:     "SET_SERVER_URL_ACTION",
  ADD_LIBRARY_ACTION: "ADD_LIBRARY_ACTION"
};

export const JOURNAL = {
  TYPE: "JOURNAL_TYPE",
  ADD_ENTRY:  "ADD_JOURNAL_ENTRY_ACTION"
};

export const PENDING = {
  DELETE_ALL: "DELETE_ALL_ACTION",
  DELETE:     "DELETE_BY_GUID"
};

export const LIBRARY = {
  TYPE: "LIBRARY_TYPE",
  ADD_ENTRY:  "ADD_LIBRARY_ENTRY_ACTION"
};

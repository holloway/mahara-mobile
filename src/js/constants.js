/*jshint esnext: true */

export const PAGE = {
  SERVER:  "SERVER",
  LOGIN:   "LOGIN",
  USER:    "USER",
  ADD:     "ADD",
  PENDING: "PENDING",
  SYNC:    "SYNC"
};

export var PAGE_CLASSNAME = {};
PAGE_CLASSNAME[PAGE.SERVER]  = "Page_Server";
PAGE_CLASSNAME[PAGE.LOGIN]   = "Page_Login";
PAGE_CLASSNAME[PAGE.USER]    = "Page_User";
PAGE_CLASSNAME[PAGE.ADD]     = "Page_Add";
PAGE_CLASSNAME[PAGE.PENDING] = "Page_Pending";
PAGE_CLASSNAME[PAGE.SYNC]    =  "Page_Sync";

export var PAGE_URL = {};
PAGE_URL[PAGE.SERVER]  = "";
PAGE_URL[PAGE.LOGIN]   = "/Login";
PAGE_URL[PAGE.USER]    = "/User";
PAGE_URL[PAGE.ADD]     = "/Add";
PAGE_URL[PAGE.PENDING] = "/Pending";
PAGE_URL[PAGE.SYNC]    = "/Sync";


export const STORAGE = {
  SERVER_URL:     "Server_Url",
  SET_SERVER_URL: "SET_SERVER_URL_ACTION"
};

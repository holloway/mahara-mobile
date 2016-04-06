/*jshint esnext: true */

export function log(...args){
  if(console && console.log){
    if(console.log.apply){
      console.log.apply(console, args);
      if(console.trace) console.trace();
    } else {
      console.log("Console.log.apply doesn't exist.");
      console.log(args);
    }
  } else {
    // No console available.
  }
}

export function warn(...args){
  if(console && console.warn){
    if(console.warn.apply){
      console.warn.apply(console, args);
      if(console.trace) console.trace();
    } else {
      console.warn("Console.log.apply doesn't exist.");
      console.warn(args);
    }
  } else {
    log(args);
  }
}
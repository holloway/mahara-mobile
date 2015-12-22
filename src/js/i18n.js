/*jshint esnext: true */

export function getLangStrings(langIds){
  // langIds = ['en', 'fr'] in order of precedence
  var allStrings = window.mahara.i18n.strings,
      strings = {},
      langStrings,
      langId;

  if(!langIds){
    console.log("langIds='" + JSON.stringify(langIds) + "'.");
    return;
  }

  for(var i = 0; i < langIds.length; i++){
    langId = langIds[i];

    langStrings = allStrings[langId];
    if(!allStrings.hasOwnProperty(langId)){
      console.log("Language '" + langId + "' doesn't exist in " + JSON.stringify(Object.keys(allStrings)) + ". The fallbacks are " + JSON.stringify(langIds));
    } else {
      for(var key in langStrings){
        if(!strings.hasOwnProperty(key)){
          strings[key] = langStrings[key];
        }
      }
    }
  }

  return strings;
}

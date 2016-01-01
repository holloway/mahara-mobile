/*jshint esnext: true */

export function getLangString(langIds, stringId){
  // langIds = ['en', 'fr'] in order of precedence
  var allStrings = window.mahara.i18n.strings,
      langStrings,
      langId;

  if(!langIds) return console.log("getLangString called with empty langIds. stringId=", stringId);

  for(var i = 0; i < langIds.length; i++){
    langId = langIds[i];
    if(!allStrings.hasOwnProperty(langId)){
      console.log("Language '" + langId + "' doesn't exist in " + JSON.stringify(Object.keys(allStrings)) + ". The fallbacks are " + JSON.stringify(langIds));
    } else {
      langStrings = allStrings[langId];
      if(!langStrings.hasOwnProperty(stringId)){
        console.log("Language '" + langId + "' doesn't have a stringId of '" + stringId + "'. Using fallback list of " + JSON.stringify(langIds));
      } else {
        return langStrings[stringId];
      }
    }
  }
}

/*jshint esnext: true */

export function l10n(langId){
  var fallbacks = ['en', 'fr']; //FIXME: make configurable
  var locales = window.mahara.locales;
  for(var i = 0; i < fallbacks.length; i++){
    var langString = locales[fallbacks[i]][langId];
    if(langString) return langString;
  }
  return "{TRANSLATION:" + langId + "}";
}

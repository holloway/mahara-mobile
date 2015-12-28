/*jshint esnext: true */
import React           from 'react';
import {getLangString} from '../i18n.js';

export default class MaharaBaseComponent extends React.Component {
  gettext(langStringId){
    var langString = getLangString(this.props.lang, langStringId);
    if(langString !== undefined){
      return langString;
    }
    return "{i18n:" + langStringId + "}";
  }
}

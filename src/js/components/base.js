/*jshint esnext: true */
import React            from 'react';
import {getLangString}  from '../i18n.js';

export class MaharaBaseComponent extends React.Component {
  gettext(stringId){
    var string = getLangString(this.props.langOrder, stringId);
    if(string !== undefined){
      return string;
    }
    return "{i18n:" + stringId + "}";
  }
}

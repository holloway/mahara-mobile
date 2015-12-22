/*jshint esnext: true */
import React from 'react';

export class MaharaBaseComponent extends React.Component {
  gettext(stringId){
    if(this.props.lang.hasOwnProperty(stringId)){
      return this.props.lang[stringId];
    }
    return "TRANSLATE:" + stringId;
  }
}

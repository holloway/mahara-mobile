/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {PENDING}           from '../../constants.js';

class PendingItem extends MaharaBaseComponent {
  render() {
    return <div key={this.props.guid} className={"item" + (this.props.lastItem ? " lastItem" : "")}>
      <h2>
        <button onClick={this.delete} className="delete">&times;</button>
        {this.props.title}
      </h2>
      <p>{this.props.body}</p>
    </div>;
  }
  delete = () => {
    var that = this;
    var reallyDelete = function(){
      StateStore.dispatch({type:PENDING.DELETE, guid:that.props.guid});
    }
    reallyDelete(); //TODO: Use confirm dialog
  }
}

export default PendingItem;

/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {PENDING}           from '../../constants.js';
import PendingItem         from './pending-item.js';

class Pending extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Pending</h1>
      {this.renderPendingUploads()}
      {this.renderDeleteAll()}
    </section>;
  }
  deleteAll = () => {
    var reallyDeleteAll = function(){
      StateStore.dispatch({type:PENDING.DELETE_ALL});
    }
    reallyDeleteAll(); //TODO: Use confirm dialog
  }
  renderDeleteAll = () => {
    if(this.noPendingUploads()) return "";
    return <div className="deleteAllButtonTray">
      <button onClick={this.deleteAll} className="deleteAll">Delete All</button>
    </div>
  }
  noPendingUploads = () => {
    return (!this.props.pendingUploads || this.props.pendingUploads.length === 0);
  }
  renderPendingUploads = () => {
    var that = this;
    if(this.noPendingUploads()) return <i>No pending uploads.</i>;
    return this.props.pendingUploads.map(function(item, i){
      return <PendingItem key={item.guid} {...item} lastItem={i === that.props.pendingUploads.length - 1}/>
    })
  }
}

export default Pending;

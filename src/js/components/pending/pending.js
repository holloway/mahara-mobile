/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {JOURNAL}           from '../../constants.js';
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
      StateStore.dispatch({type:JOURNAL.DELETE_ALL});
    }
    reallyDeleteAll(); //TODO: Use confirm dialog
  }
  renderDeleteAll = () => {
    if(!this.props.pendingUploads || this.props.pendingUploads.length === 0) return "";
    return <div className="deleteAllButtonTray">
      <button onClick={this.deleteAll} className="deleteAll">Delete All</button>
    </div>
  }
  renderPendingUploads = (PAGE_ID) => {
    var that = this;
    if(!this.props.pendingUploads) return <i>No pending uploads.</i>;
    return this.props.pendingUploads.map(function(item, i){
      console.log(i === that.props.pendingUploads.length)
      return <PendingItem key={item.guid} {...item} lastItem={i === that.props.pendingUploads.length - 1}/>
    })
  }
}

export default Pending;

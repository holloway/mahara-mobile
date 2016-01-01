/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent                   from '../base.js';
import StateStore                            from '../../state.js';
import Router                                from '../../router.js';
import {PENDING, LIBRARY, JOURNAL, PAGE_URL} from '../../constants.js';

class PendingItem extends MaharaBaseComponent {
  render() {
    return <div key={this.props.guid} className={"item" + (this.props.lastItem ? " lastItem" : "")} onClick={this.edit}>
      <h2>
        <button onClick={this.delete} className="delete">&times; Delete</button>
        {this.props.title}
      </h2>
      <p>{this.props.body}</p>
    </div>;
  }
  delete = (e) => {
    e.stopPropagation();
    var that = this;
    var reallyDelete = function(){
      StateStore.dispatch({type:PENDING.DELETE, guid:that.props.guid});
    }
    alertify.okBtn(this.gettext("confirm_delete_ok_button"))
            .cancelBtn(this.gettext("button_cancel"))
            .confirm(this.gettext("confirm_delete"), reallyDelete);
  }
  edit = (e) => {
    e.stopPropagation();
    switch(this.props.type){
      case LIBRARY.TYPE:
        Router.navigate(PAGE_URL.ADD_LIBRARY + "/" + this.props.guid);
        break;
      case JOURNAL.TYPE:
        Router.navigate(PAGE_URL.ADD_JOURNAL_ENTRY + "/" + this.props.guid);
        break;
    }
  }
}

export default PendingItem;

/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';
import Router              from '../../router.js';

export default class ServerPage extends MaharaBaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      serverUrl: props.server && props.server.url && props.server.url.protocol && props.server.url.domain ? (props.server.url.protocol + "://" + props.server.url.domain) : ""
    };
  }
  render() {
    return <section>
      <label htmlFor="serverUrl">{this.gettext('server_question')}</label>
      <input type="url" ref="serverUrl" value={this.state.serverUrl} onChange={this.onChange} placeholder={this.gettext('server_url_example')} id="serverUrl"/>
      <button onClick={this.nextButton}>{this.gettext('wizard_next_button')}</button>
    </section>;
  }
  onChange = (e) => {
    this.setState({serverUrl: this.refs.serverUrl.value});
  }
  nextButton = (e) => {
    var serverUrl = this.refs.serverUrl.value,
        that      = this;

    if(serverUrl.trim().length === 0) {
      alertify.alert(this.gettext("server_url_empty_validation"));
      return;
    };

    StateStore.dispatch({type:STORAGE.SET_SERVER_URL, serverUrl:serverUrl});

    Router.navigate(PAGE_URL.LOGIN_TYPE);
  }
}

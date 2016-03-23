/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';
import Router              from '../../router.js';
import maharaServer        from '../../mahara-lib/mahara-server.js';
import {LOGIN_TYPE}        from '../../mahara-lib/constants.js';

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

    maharaServer.setUrl(serverUrl, next);

    function next(){
      StateStore.dispatch({type:STORAGE.SET_SERVER_URL, serverUrl: {domain: maharaServer.domain, protocol:maharaServer.protocol}});
      StateStore.dispatch({type:STORAGE.SET_SERVER_LOGIN_TYPES, loginTypes: maharaServer.loginTypes, ssoUrl: maharaServer.ssoUrl});
      Router.navigate(PAGE_URL.LOGIN_TYPE);
    }
  }
}

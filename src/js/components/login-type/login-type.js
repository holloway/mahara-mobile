/*jshint esnext: true */
import React                  from 'react';
import MaharaBaseComponent    from '../base.js';
import StateStore,
       {maharaServer}         from '../../state.js';
import Router                 from '../../router.js';
import {PAGE_URL,
        LOGIN_TYPE,
        STORAGE}              from '../../constants.js';

class LoginTypePage extends MaharaBaseComponent {
  render() {
    if(!this.props.server || !this.props.server.domain){
      return <section>
        <a onClick={this.chooseServer} className="noServerConfigured">{this.gettext('login_type_error_choose_server')}</a>
      </section>
    } else {
      return <section>
        <h2>{this.gettext('login_types_header')}</h2>
        {this.supportsSingleSignOn()}
        {this.supportsLocalLogin()}
      </section>;
    }
  };
  chooseServer = () => {
    Router.navigate(PAGE_URL.SERVER);
  };
  supportsSingleSignOn = () => {
    if(this.props.server && this.props.server.loginTypes && this.props.server.loginTypes.indexOf(LOGIN_TYPE.SINGLE_SIGN_ON) === -1) return "";
    return <button onClick={this.sso}><abbr title="Single Sign-on">{this.gettext("single_sign_on")}</abbr></button>
  };
  supportsLocalLogin = () => {
    if(this.props.server && this.props.server.loginTypes && this.props.server.loginTypes.indexOf(LOGIN_TYPE.LOCAL) === -1) return "";
    return <button onClick={this.local}>{this.gettext("local_username_password")}</button>
  };
  sso = (e) => {
    StateStore.dispatch({type:STORAGE.SET_SERVER_CHOSEN_LOGIN_TYPE, loginType: LOGIN_TYPE.SINGLE_SIGN_ON});
    Router.navigate(PAGE_URL.SSO);
  };
  local = (e) => {
    console.log("local");
    StateStore.dispatch({type:STORAGE.SET_SERVER_CHOSEN_LOGIN_TYPE, loginType: LOGIN_TYPE.LOCAL});
    Router.navigate(PAGE_URL.LOGIN);
  }
}

export default LoginTypePage;

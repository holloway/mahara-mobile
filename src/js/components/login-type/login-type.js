/*jshint esnext: true */
import React                  from 'react';
import MaharaBaseComponent    from '../base.js';
import StateStore,
       {maharaServer}         from '../../state.js';
import Router                 from '../../router.js';
import {PAGE_URL,
        LOGIN_TYPE,
        STORAGE,
        LOGIN}              from '../../constants.js';

class LoginTypePage extends MaharaBaseComponent {
  
  render() {
    if(!this.props.server || !this.props.server.wwwroot){
      return <section>
        <button onClick={this.changeServer} className="changeServer">{this.gettext('login_type_error_choose_server')}</button>
      </section>;
    } else {
      return <section>
        <p className="textLinks">({this.props.server.wwwroot}) <a onClick={this.changeServer} className="changeServer">{this.gettext('wizard_change_server')}</a></p>
        <h2>{this.gettext('login_types_header')}</h2>
        {this.supportsSingleSignOn()}
        {this.supportsLocalLogin()}
      </section>;
    }
  }

  changeServer = (e) => {
    e.preventDefault();
    Router.navigate(PAGE_URL.SERVER);
  };
  
  supportsSingleSignOn = () => {
    if(this.props.server && this.props.server.loginTypes && this.props.server.loginTypes.indexOf(LOGIN_TYPE.SINGLE_SIGN_ON) === -1) return "";
    return <button onClick={this.sso} className="loginType"><abbr title="Single Sign-on">{this.gettext("single_sign_on")}</abbr></button>;
  };
  
  supportsLocalLogin = () => {
    if(this.props.server && this.props.server.loginTypes && this.props.server.loginTypes.indexOf(LOGIN_TYPE.LOCAL) === -1) return "";
    return <button onClick={this.local} className="loginType">{this.gettext("local_username_password")}</button>;
  };
  
  sso = (e) => {
    maharaServer.openSsoWindow(this.ssoSuccess);
  };

  ssoSuccess = (token) => {
    StateStore.dispatch({
        type: LOGIN.AFTER_LOGIN_GET_PROFILE,
        token: token
    });
    Router.navigate(PAGE_URL.ADD);
  }
  
  local = (e) => {
    Router.navigate(PAGE_URL.LOGIN);
  }
}

export default LoginTypePage;

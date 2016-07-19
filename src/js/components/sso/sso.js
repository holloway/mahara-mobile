/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import Router              from '../../router.js';
import {PAGE,
        LOGIN,
        PAGE_URL,
        STORAGE}           from '../../constants.js';

class SSOPage extends MaharaBaseComponent {
  constructor(props){
    super(props)
  }
  render() {
    if(!maharaServer.ssoUrl){
      return <section>
        <p>
          {this.gettext('no_sso_url_found')}
          <a onClick={this.goBackToServer} className="noSSOFound">{this.gettext('try_again_question')}</a>
        </p>
      </section>
    } else if(this.props.server.ssoAvailable === undefined){
      return <section>
        <p>{this.gettext('waiting_for_sso')}</p>
      </section>
    } else if(this.props.server.ssoAvailable === true){
      return <iframe src={maharaServer.ssoUrl} ref="iframe"></iframe>
    } else if(this.props.server.ssoAvailable === false) {
      return <section>
        <p>
          {this.gettext('sso_error')}<br/>
          <button onClick={this.ssoIsAvailable} className="goBack">{this.gettext('try_sso_anyway')}</button><br/>
          <button onClick={this.goBackToServer} className="goBack">{this.gettext('choose_different_login_method')}</button>
        </p>
        <p>{this.gettext('sso_error_url_before')}<br/>
          <a href={maharaServer.ssoUrl} onClick={this.gotoSSOUrlManually} className="ssoError">{maharaServer.ssoUrl}</a>
        </p>
      </section>
    } else {
      return <section><p>(unknown SSO state)</p></section>;
    }
  }
  componentWillMount = () => {
    //console.log("Before about to check...");
    maharaServer.isSSOServerAvailable(this.ssoIsAvailable, this.ssoIsNotAvailable);
  }
  gotoSSOUrlManually = (e) => {
    e.preventDefault();
    var winRef = window.open(maharaServer.ssoUrl, "ssoServerUrl");
    winRef.opener = null; // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
  }
  ssoIsAvailable = () => {
    //console.log("ssoIsAvailable...");
    this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
    StateStore.dispatch({type:LOGIN.SSO_IS_AVAILABLE});
  }
  ssoIsNotAvailable = () => {
    //console.log("ssoIsNotAvailable...");
    StateStore.dispatch({type:LOGIN.SSO_NOT_AVAILABLE});
  }
  checkIfLoggedInEveryMilliseconds = 1000;
  checkIfLoggedIn = () => {
    //console.log("Checking...");
    maharaServer.getLoginStatus(this.checkIfLoggedInResult, this.checkIfLoggedInFailure);
  }
  checkIfLoggedInResult = (isLoggedIn) => {
    //console.log("Checked...", isLoggedIn);
    if(this.loginChecker) clearTimeout(this.loginChecker);
    if(isLoggedIn){
      Router.navigate(PAGE_URL.ADD);
      StateStore.dispatch({type:LOGIN.AFTER_LOGIN_GET_PROFILE});
    } else {
      if(!this.hasUnmounted) this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
    }
  }
  checkIfLoggedInFailure = (e) => {
    //console.log("sso failure", arguments);
    if(this.loginChecker) clearTimeout(this.loginChecker);
    StateStore.dispatch({type:LOGIN.SSO_NOT_AVAILABLE});
  }
  componentWillUnmount = () => {
    this.hasUnmounted = true; //TODO: refactor this into Redux
    if(this.loginChecker) clearTimeout(this.loginChecker);
  }
  goBackToServer = () => {
    Router.navigate(PAGE_URL.SERVER);
  }
}

export default SSOPage;

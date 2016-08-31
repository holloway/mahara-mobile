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

class LoginPage extends MaharaBaseComponent {
  
  render() {
    return <section>
      <p className="textLinks">
        {this.props.server && this.props.server.url ? "(" + this.props.server.url + ")" : ""}
        <button onClick={this.backButton} className="changeServer">{this.gettext('wizard_change_server')}</button>
      </p>
      <label htmlFor="username">{this.gettext('username')}</label>
      <input type="text" ref="username" id="username"/>
      <label htmlFor="password">{this.gettext('password')}</label>
      <input type="password" ref="password" id="password"/>
      <button onClick={this.nextButton} className="next">{this.gettext('wizard_login_button')}</button>
    </section>;
  }

  componentWillMount(){
    if(!this.props.server.url) {
      alertify.okBtn(this.gettext("alert_ok_button")).alert(this.gettext("cant_login_no_server_configured"), function(){
        Router.navigate(PAGE_URL.SERVER);
      });
    }
  }
  backButton = (e) => {
    Router.navigate(PAGE_URL.SERVER);
  }
  nextButton = (e) => {
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    if(username.trim().length === 0) {
      alertify.okBtn(this.gettext("alert_ok_button")).alert(this.gettext("username_empty_validation"));
      return;
    }

    if(password.trim().length === 0) {
      alertify.okBtn(this.gettext("alert_ok_button")).alert(this.gettext("password_empty_validation"));
      return;
    }

    maharaServer.usernamePasswordLogin(username, password, successCallback, errorCallback);

    function successCallback(response){
      if(response.loggedIn){
        StateStore.dispatch({type:LOGIN.AFTER_LOGIN_GET_PROFILE});
        Router.navigate(PAGE_URL.ADD);
      } else {
        alertify.okBtn(that.gettext("alert_ok_button"))
                .alert(that.gettext("server_says_wrong_username_password"));
      }
    }

    function errorCallback(response){
      if(!response || response.error){
        console.log("Error logging in", response);
        return;
      }
      // TODO: differentiate between different types of failed login
      alertify.okBtn(that.gettext("alert_ok_button"))
              .alert(that.gettext("server_login_error"));
    }
  }
}

export default LoginPage;

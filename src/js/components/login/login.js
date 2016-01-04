/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import Router              from '../../router.js';
import maharaServer        from '../../mahara-lib/mahara-server.js';
import {PAGE, PAGE_URL, STORAGE} from '../../constants.js';

class LoginPage extends MaharaBaseComponent {
  render() {
    return <section>
      <h3>{this.gettext('username')}</h3>
      <input type="text" ref="username"/>
      <h3>{this.gettext('password')}</h3>
      <input type="password" ref="password"/>
      <button onClick={this.backButton} className="back">{this.gettext('backButton')}</button>
      <button onClick={this.nextButton} className="next">{this.gettext('nextButton')}</button>
    </section>;
  }
  componentWillMount(){
    if(!maharaServer.protocol || !maharaServer.domain) {
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
    };
    if(password.trim().length === 0) {
      alertify.okBtn(this.gettext("alert_ok_button")).alert(this.gettext("password_empty_validation"));
      return;
    };
    maharaServer.usernamePasswordLogin(username, password, successfulLogin, failedLogin);
    function successfulLogin(loginDetails){
      StateStore.dispatch({type:STORAGE.SET_SERVER_SESSION, token:loginDetails.token, user: loginDetails.user});
      alertify.okBtn(that.gettext("alert_ok_button")).alert(that.gettext("logged_in_as") + loginDetails.user, next);
      function next(){
        Router.navigate(PAGE_URL.ADD);
      }
    }
    function failedLogin(){
      // FIXME: differentiate between different types of failed login
      alertify.okBtn(that.gettext("alert_ok_button")).alert(that.gettext("server_says_wrong_username_password"));
    }
  }
}

export default LoginPage;

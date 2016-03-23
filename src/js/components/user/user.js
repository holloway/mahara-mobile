/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';
import maharaServer        from '../../mahara-lib/mahara-server.js';

class User extends MaharaBaseComponent {
  render() {
    return <section>
      <h2>{this.props.server.user}</h2>

      <hr/>
      <button onClick={this.logoutButton} className="big">{this.gettext("logout_button")}</button>
    </section>;
  }
  logoutButton = (e) => {
    alertify.okBtn(this.gettext("alert_ok_button"));
    alertify.cancelBtn(this.gettext("button_cancel"));
    alertify.confirm(this.gettext("logout_confirmation"), function (e, str) {
      if(e){
        maharaServer.logout(function(isLoggedIn){
          console.log("Is logged in?", isLoggedIn);
          Router.navigate(PAGE_URL.LOGIN_TYPE);
        });
      } else {
        //nothing
      }
    });
  }
}

export default User;

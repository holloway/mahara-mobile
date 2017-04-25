/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';
import {maharaServer}      from '../../state.js';
import ReactPullToRefresh  from 'react-pull-to-refresh';
import SelectJournal       from '../select-journal/select-journal.js';

const defaultIcon = "image/profile-default.png";
class User extends MaharaBaseComponent {
    constructor() {
        super();
        this.logoutButton = this.logoutButton.bind(this);
        this.loginButton = this.loginButton.bind(this);
        this.logout = this.logout.bind(this);
        this.renderServer = this.renderServer.bind(this);
        this.changeServer = this.changeServer.bind(this);
    }

    render() {
        //console.log("PROPS?", this.props);
        var siteName = 'Mahara';
        var icon;
        var displayName;

        if (this.props.server) {
            if (this.props.server.siteName) {
                siteName = this.props.server.siteName;
            }

            if (this.props.server.profile.iconurl) {
                icon = this.props.server.profile.iconurl;
            }
            else {
                icon = defaultIcon;
            }

            if (this.props.server && this.props.server.profile && this.props.server.profile.myname) {
                displayName = this.props.server.profile.myname;
            }
            else {
                displayName = "";
            }
        }
        else {
            siteName = `(${this.gettext('offline')})`;
            icon = defaultIcon;
            displayName = "";
        }
        if (!this.props.server.profile.id) {
        return  <section>
                  <button onClick={this.loginButton} className="big">{this.gettext('wizard_login_button') }</button>
                </section>;
        } else {
        return <ReactPullToRefresh onRefresh={maharaServer.refreshUserProfile} hammerOptions={{'touchAction': 'auto'}}>
                <section>
                  <h2>{siteName}</h2>
                  <div className="userBlock">
                    <img src={icon} className="profile"/>
                    <div style={{'marginRight': '1em'}}>{displayName}</div>
                    <a onClick={this.logoutButton} className="logout">{this.gettext("logout_button") }</a>
                  </div>
                  <div className="userInfoBlock">
                    {this.renderServer() }
                    <SelectJournal {...this.props} />
                  </div>
                  <hr/>
                </section>
            </ReactPullToRefresh>
        ;
      }
    }

    logoutButton() {
        alertify.okBtn(this.gettext("alert_ok_button"));
        alertify.cancelBtn(this.gettext("button_cancel"));
        alertify.confirm(this.gettext("logout_confirmation"), (e, str) => {
            if (e) {
              this.logout();
            } else {
                //nothing
            }
        });
    }

    loginButton() {
      this.logout();
    }

    logout() {
      maharaServer.logOut(function (isLoggedIn) {
          // console.log("Is logged in?", isLoggedIn);
          Router.navigate(PAGE_URL.SERVER);
      }, function (err) {
          console.log("Couldn't logout. This probably doesn't matter.", err);
          Router.navigate(PAGE_URL.SERVER);
      });
    }
    
    renderServer() {
        if (!this.props.server || !this.props.server.wwwroot) return "";
        return  <div className="setting">
                  <div>
                    <label htmlFor="user-server">{this.gettext("site")}: </label>
                    <div id="user-server">
                      <span>{this.props.server.wwwroot}</span>
                    </div>
                  </div>
                  <a onClick={this.changeServer} className="changeServer change-settings" ></a>
                </div>;
    }

    changeServer() {
        Router.navigate(PAGE_URL.SERVER);
    }
}

export default User;

/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';
import {maharaServer}      from '../../state.js';
import ReactPullToRefresh  from 'react-pull-to-refresh';
import MaharaSelector      from './mahara-selector/selector.js';
import StateStore          from '../../state.js';
import {STORAGE}           from '../../constants.js';


const defaultIcon = "image/profile-default.png";
class User extends MaharaBaseComponent {
    constructor() {
        super();
        this.logoutButton = this.logoutButton.bind(this);
        this.loginButton = this.loginButton.bind(this);
        this.logout = this.logout.bind(this);
        this.renderServer = this.renderServer.bind(this);
        this.changeServer = this.changeServer.bind(this);

        this.setLanguage = this.setLanguage.bind(this);
        this.setJournal = this.setJournal.bind(this);
        this.setFolder = this.setFolder.bind(this);
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
          let langOptions = Object.keys(window.mahara.i18n.strings);
          let journalOptions = this.props.server.sync.blogs.map(blog =>  {
                    return {
                      'id': blog.id,
                      'text': blog.title
                    };
                  });
          let folderOptions = this.props.server.sync.folders.map(folder =>  {
                    return {
                      'id': folder.title,
                      'text': folder.title
                    };
                  });
          let defaultFolder = this.props.server.defaultFolderName ? folderOptions.find(folder => folder.id === this.props.server.defaultFolderName) : { 'id': '', 'title': ''};
          let defaultJournal = this.props.server.defaultBlogId ? journalOptions.find(blog => blog.id === this.props.server.defaultBlogId) : { 'id': '', 'title': ''};

          let lang = this.props.lang.find(l => langOptions.indexOf(l) > -1);

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

                    <MaharaSelector
                      label={this.gettext("default_journal")}
                      defaultOption={defaultJournal}
                      name="journalSelect"
                      options={journalOptions}
                      onSetSelection={this.setJournal}
                      ></MaharaSelector>

                    <MaharaSelector
                      label={this.gettext("default_language")}
                      defaultOption={{'text': lang, 'id': lang}}
                      name="languageSelect"
                      options={langOptions}
                      onSetSelection={this.setLanguage}
                      ></MaharaSelector>

                      <MaharaSelector
                        label={this.gettext("default_folder")}
                        defaultOption={defaultFolder}
                        name="folderSelect"
                        options={folderOptions}
                        onSetSelection={this.setFolder}
                        ></MaharaSelector>
                  </div>
                  <hr/>
                </section>
            </ReactPullToRefresh>
        ;
      }
    }

    setLanguage(lang) {
      StateStore.dispatch({ type: STORAGE.SET_USER_LANGUAGE, language: lang });
    }
    setJournal(journal) {
      StateStore.dispatch({ type: STORAGE.SET_DEFAULT_JOURNAL, journal: parseInt(journal, 10) });
    }

    setFolder(folder) {
      StateStore.dispatch({ type: STORAGE.SET_DEFAULT_FOLDER, folder: folder});
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

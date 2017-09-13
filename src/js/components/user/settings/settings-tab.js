import React, { PropTypes } from 'react';
import MaharaBaseComponent  from '../../base.js';
import {PAGE_URL}           from '../../../constants.js';
import {maharaServer}       from '../../../state.js';
import MaharaSelector       from '../mahara-selector/selector.js';
import StateStore           from '../../../state.js';
import Router               from '../../../router.js';
import {STORAGE}            from '../../../constants.js';

const defaultIcon = "image/profile-default.png";

class SettingsTab extends MaharaBaseComponent {
    constructor() {
        super();

        this.renderServer = this.renderServer.bind(this);
        this.changeServer = this.changeServer.bind(this);

        this.setLanguage = this.setLanguage.bind(this);
        this.setJournal = this.setJournal.bind(this);
        this.setFolder = this.setFolder.bind(this);
    }

    render() {
        var siteName = 'Mahara';
        var icon;
        var displayName;

          let defaultFolder, defaultJournal, defaultLanguage;
          // language select setup
          let langOptions = Object.keys(window.mahara.i18n.strings).map(lang => {
            return {
              'id': lang,
              'text': lang
            };
          }) || [];
          if (this.props.lang.length && langOptions.length) {
            this.props.lang.forEach(lang => {
                if (!defaultLanguage) {
                  defaultLanguage =  langOptions.find(language => language.id === lang);
                }
            });
          }

          if (!defaultLanguage) {
            defaultLanguage = { 'id': '', 'title': ''};
          }

          // lang = this.props.lang.find(language => langOptions.indexOf(language) > -1);

          // journal select setup
          let journalOptions = this.props.server.sync.blogs.map(blog =>  {
                    return {
                      'id': blog.id,
                      'text': blog.title
                    };
                  });
          if (this.props.server.defaultBlogId && journalOptions.length) {
            defaultJournal = journalOptions.find(blog => blog.id === this.props.server.defaultBlogId);
          } else {
            defaultJournal = { 'id': '', 'title': ''};
          }

          // folder select setup
          let folderOptions = this.props.server.sync.folders.map(folder =>  {
                    return {
                      'id': folder.title,
                      'text': folder.title
                    };
                  });
          if (this.props.server.defaultFolderName && folderOptions.length) {
            defaultFolder = folderOptions.find(folder => folder.id === this.props.server.defaultFolderName);
          } else {
            defaultFolder = { 'id': '', 'title': ''};
          }

          return <section>
                    <h2>{siteName}</h2>
                    <div className="userInfoBlock">
                      <div className="back">
                        <a onClick={this.props.onGoBack}>Back to Profile</a>
                      </div>
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
                        defaultOption={defaultLanguage}
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
                  </section>;
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


    renderServer() {
        if (!this.props.server || !this.props.server.wwwroot) return "";
        return  <div className="setting">
                  <div>
                    <label htmlFor="user-server">{this.gettext("site")}: </label>
                    <div id="user-server">
                      <span>{this.props.server.wwwroot}</span>
                    </div>
                  </div>
                  <button onClick={this.changeServer} className="button change-settings" ></button>
                </div>;
    }

    changeServer() {
        Router.navigate(PAGE_URL.SERVER);
    }
}

export default SettingsTab;

SettingsTab.propTypes = {
  server: PropTypes.object.isRequired
};

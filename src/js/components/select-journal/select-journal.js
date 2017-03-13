/*jshint esnext: true */
import React, { PropTypes }     from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';
import Router              from '../../router.js';
import Select2             from 'react-select2';

export default class SelectJournal extends MaharaBaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      isEditable: false,
      defaultJournal: null
    };

    this.setDefaultJournal = this.setDefaultJournal.bind(this);
    this.changeDefaultJournal = this.changeDefaultJournal.bind(this);
    this.defaultJournalChanged = this.defaultJournalChanged.bind(this);
  }

  render() {
      let options = this.props.server.sync.blogs.map(blog =>  {
          return {
            'id': blog.id,
            'text': blog.title
          };
        });
      if (this.state.isEditable) {
          return <div className="setting">
                  <div>
                    <label htmlFor="default-journal">{this.gettext("default_journal")}:&nbsp;</label>
                    <Select2
                      defaultValue={this.props.server.defaultBlogId}
                      onChange={this.defaultJournalChanged}
                      ref="journalSelect"
                      data={options}
                      options={
                        {
                          width: '80%',
                          "marginRight": "5px",
                          minimumResultsForSearch: -1,
                        }
                      }
                      />
                  </div>
                <a onClick={this.setDefaultJournal} className="save-button"></a>
              </div>;
      } else {
        let defaultBlogTitle = this.props.server.defaultBlogId ? this.props.server.sync.blogs.find(blog => blog.id === this.props.server.defaultBlogId).title : '';
        return  <div className="setting">
                  <div>
                    <label htmlFor="default-journal">{this.gettext("default_journal")}:&nbsp;</label>
                    <div id="default-journal">{defaultBlogTitle}</div>
                  </div>
                  <a onClick={this.changeDefaultJournal} className="change-settings"></a>
                </div>;
      }
  }

  defaultJournalChanged(journal) {
      this.setState({ 'defaultJournal': parseInt(this.refs.journalSelect.el.select2('data')[0].id, 10) });
  }

  setDefaultJournal(journal) {
      StateStore.dispatch({ type: STORAGE.SET_DEFAULT_JOURNAL, journal: this.state.defaultJournal });
      this.setState({ isEditable: false });
  }

  changeDefaultJournal() {
      this.setState({ isEditable: true });
  }

}

SelectJournal.propTypes = {
  server: PropTypes.object.isRequired
};

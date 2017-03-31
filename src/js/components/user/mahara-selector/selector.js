import React, { PropTypes }     from 'react';
import MaharaBaseComponent from '../../base.js';
import StateStore,
       {maharaServer}      from '../../../state.js';
import {STORAGE, PAGE_URL} from '../../../constants.js';
import Router              from '../../../router.js';
import Select2             from 'react-select2';

export default class MaharaSelector extends MaharaBaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      isEditable: false,
      selection: null
    };

    this.setSelection = this.setSelection.bind(this);
    this.makeEditable = this.makeEditable.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
  }

  render() {
      if (this.state.isEditable) {
          return <div className="setting">
                  <div>
                    <label htmlFor="default-journal">{this.props.label}:</label>
                    <Select2
                      defaultValue={this.props.defaultOption.id}
                      onChange={this.selectionChanged}
                      ref={this.props.name}
                      data={this.props.options}
                      options={
                        {
                          width: '80%',
                          "marginRight": "5px",
                          minimumResultsForSearch: -1,
                        }
                      }
                      />
                  </div>
                <button onClick={this.setSelection} className="btn save"></button>
              </div>;
      } else {
        return  <div className="setting">
                  <div>
                    <label htmlFor="default-journal">{this.props.label}:&nbsp;</label>
                    <div id="default-journal">{this.props.defaultOption.text}</div>
                  </div>
                  <button onClick={this.makeEditable} className="btn change-settings"></button>
                </div>;
      }
  }

  selectionChanged() {
      this.setState({ 'selection': this.refs[this.props.name].el.select2('data')[0].id });
  }

  setSelection() {
    this.props.onSetSelection(this.state.selection);
    this.setState({ isEditable: false });
  }

  makeEditable() {
      this.setState({ isEditable: true });
  }

}

MaharaSelector.propTypes = {
  label: PropTypes.string,
  defaultOption: PropTypes.object,
  name: PropTypes.string,
  options: PropTypes.array,
  onSetSelection: PropTypes.func
};

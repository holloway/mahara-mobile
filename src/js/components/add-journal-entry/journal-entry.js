/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Select2             from 'react-select2';
import {maharaServer}      from '../../state.js';

class JournalEntry extends MaharaBaseComponent {
    constructor(props) {
        super(props);
        var existingTags = [];

        if (maharaServer.sync && maharaServer.sync.tags) {
            for (var i = 0; i < maharaServer.sync.tags.length; i++) {
                existingTags.push(maharaServer.sync.tags[i].id);
            }
        }

        if (props.guid) {
            this.guid = props.guid;
        }

        this.state = {
            existingTags: existingTags
        };
        this.changeTags = this.changeTags.bind(this);
    }
    render() {
        var title = '';
        var body = '';
        var tags = [];
        if (this.guid) {
            title = this.props.title;
            body = this.props.body;
            tags = this.props.tags;
        }

        return <div>
            <h2>Title</h2>
            <input ref="title" type="text" className="subject" defaultValue={title} />
            <h2>Detail</h2>
            <textarea ref="textarea" className="body" defaultValue={body} />
            <h2>Tags</h2>
            <Select2
                multiple
                onChange={this.changeTags}
                ref="reactSelect2"
                data={this.state.existingTags.concat(tags)}
                defaultValue={tags}
                options={
                    {
                        placeholder: this.gettext("tags_placeholder"),
                        width: '100%',
                        tags: true
                    }
                }
            />
        </div>;
    }
    changeTags(event) {
        var tagsObj = this.refs.reactSelect2.el.select2('data'),
            tags = [],
            i;

        for (i = 0; i < tagsObj.length; i++) {
            tags.push(tagsObj[i].text);
        }

        //console.log("new tags", tags);
        this.tags = tags; // parent component accesses it this way
    }
    componentDidMount() {
        var textarea = this.refs.textarea,
            saveButtonHeight = 100, //todo: approximate height most of the time
            textareaLayout = textarea.getBoundingClientRect(),
            newTextAreaHeight = window.innerHeight - textareaLayout.top - saveButtonHeight,
            minimumHeight = 50; // 50 (pixels) is about 2 lines of text on most screens. Feel free to tweak this.

        newTextAreaHeight = newTextAreaHeight < minimumHeight ? minimumHeight : newTextAreaHeight; //clamping the value to a minimum
        textarea.style.height = newTextAreaHeight + "px";
    }
}

export default JournalEntry;

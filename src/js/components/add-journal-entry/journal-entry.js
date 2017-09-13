import React, { PropTypes }   from 'react';
import MaharaBaseComponent from '../base.js';
import Select2             from 'react-select2';

class JournalEntry extends MaharaBaseComponent {
    constructor(props) {
        super(props);
        var userTags = [];

        for (var i = 0; i < props.server.sync.tags.length; i++) {
            userTags.push(props.server.sync.tags[i].tag);
        }

        if (props.guid) {
            this.guid = props.guid;
            this.tags = this.props.tags;
        }
        else {
            this.tags = [];
        }

        this.state = {
            userTags: userTags,
            targetBlogId: props.guid ? this.props.targetBlogId : this.props.server.defaultBlogId
        };
        this.changeTags = this.changeTags.bind(this);
        this.changeJournal = this.changeJournal.bind(this);
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

        let blogOptions = this.props.server.sync.blogs.map(blog =>  {
            return {
              'id': blog.id,
              'text': blog.title
            };
          });

          // display journal selector only if there is more than one journal
          let journalSelectNode = null;
          if (this.props.server.sync.blogs.length > 1) {
              journalSelectNode =
                  <div>
                      <h2>{this.gettext('library_blog')}</h2>
                      <Select2
                            defaultValue={this.state.targetBlogId}
                            onChange={this.changeJournal}
                            ref="journalSelect"
                            data={blogOptions}
                            options={
                                {
                                    width: '100%',
                                    minimumResultsForSearch: -1,
                                }
                            }
                        />
                    </div>;
          }

        return <div>
            <h2>{this.gettext('library_title')}</h2>
            <input ref="title" type="text" className="subject" defaultValue={title} />
            <h2>{this.gettext('library_body')}</h2>
            <textarea ref="textarea" className="body" defaultValue={body} />
            <h2>{this.gettext('library_tags')}</h2>
            <Select2
                multiple
                onChange={this.changeTags}
                ref="reactSelect2"
                data={this.state.userTags.concat(tags).filter((tag, id, tags) => tags.indexOf(tag) === id)}
                defaultValue={tags}
                options={
                    {
                        placeholder: this.gettext("tags_placeholder"),
                        width: '100%',
                        tags: true
                    }
                }
            />
          {journalSelectNode}
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

    changeJournal() {
        let targetBlogId = parseInt(this.refs.journalSelect.el.select2('data')[0].id, 10);
        this.props.onChangeJournal(targetBlogId);
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

JournalEntry.propTypes = {
  server: PropTypes.object.isRequired,
  onChangeJournal: PropTypes.func.isRequired,
  guid: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  targetBlogId: PropTypes.number,
  tags: PropTypes.array,
};

JournalEntry.defaultProps = {
  guid: undefined,
  title: undefined,
  body: undefined,
  targetBlogId: undefined,
  tags: [],
};

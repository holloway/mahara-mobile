import React, { PropTypes } from 'react';
import MaharaBaseComponent  from '../base.js';
import Select2              from 'react-select2';

class ImageDetails extends MaharaBaseComponent {
    constructor(props) {
        super(props);
        var userTags = [];

        for (var i = 0; i < props.server.sync.tags.length; i++) {
            userTags.push(props.server.sync.tags[i].tag);
        }

        this.imageToEdit = props.imageToEdit;

        this.state = {
            userTags: userTags,
            targetFolderName: props.imageToEdit.guid ? this.imageToEdit.targetFolderName : this.props.server.defaultFolderName
        };

        this.changeTags = this.changeTags.bind(this);
        this.changeFolder = this.changeFolder.bind(this);
        this.tags = this.props.imageToEdit.tags;
    }
    render() {
        var title = this.props.imageToEdit.title;
        var description = this.props.imageToEdit.description;
        var tags = this.props.imageToEdit.tags;
        var img = "";
        if (this.props.imageToEdit.mimeType.indexOf('image/') === 0) {
            img = <img src={this.props.imageToEdit.fileUrl} className="fileUploadPreview"/>;
        }

        let folderOptions = this.props.server.sync.folders.map(folder =>  {
            return {
              'id': folder.title,
              'text': folder.title
            };
          });

          // display journal selector only if there is more than one journal
          let folderSelectNode = null;
          if (this.props.server.sync.folders.length > 1) {
              folderSelectNode =
                  <div>
                      <h2>{this.gettext('library_folder')}</h2>
                      <Select2
                            defaultValue={this.state.targetFolderName}
                            onChange={this.changeFolder}
                            ref="folderSelect"
                            data={folderOptions}
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
            {img}
            <h2>{this.gettext('library_title')}</h2>
            <input ref="title" type="text" className="subject" defaultValue={title} />
            <h2>{this.gettext('description')}</h2>
            <textarea ref="textarea" className="body" defaultValue={description} />
            <h2>{this.gettext('library_tags')}</h2>
            <Select2
                multiple
                onChange={this.changeTags}
                ref="reactSelect2"
                data={this.state.userTags.concat(tags)}
                defaultValue={tags}
                options={
                    {
                        placeholder: this.gettext("tags_placeholder"),
                        width: '100%',
                        tags: true
                    }
                }
            />
            {folderSelectNode}
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

    changeFolder() {
        let targetFolderName = this.refs.folderSelect.el.select2('data')[0].id;
        this.props.onChangeFolder(targetFolderName);
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

export default ImageDetails;

ImageDetails.propTypes = {
  server: PropTypes.object.isRequired,
  onChangeFolder: PropTypes.func.isRequired,
  imageToEdit: PropTypes.object.isRequired,
};

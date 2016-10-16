/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore, 
       {maharaServer}      from '../../state.js';
import ImageDetails        from './image.js';
import {FILE_ENTRY, PAGE_URL} from '../../constants.js';

class AddImage extends MaharaBaseComponent {
    render() {
        var pageTitle = this.gettext("add_image_title");
        var imageToEdit = null;
        if (this.props.imageToEdit && Array.isArray(this.props.pendingUploads)) {
            // Find the journal
            for (var i = 0; i < this.props.pendingUploads.length; i++) {
                if (this.props.pendingUploads[i].guid === this.props.imageToEdit) {
                    imageToEdit = this.props.pendingUploads[i];
                    pageTitle = this.gettext("edit_image_title");
                    break;
                }
            }
        }
        return <section>
            <h1>{pageTitle}</h1>
            <ImageDetails parent={this} {...this.props} imageToEdit={imageToEdit} ref="imageDetails"/>
            <button ref="saveButton" onClick={this.saveButton}>{this.gettext("add_image_save_button") }</button>
        </section>;
    }
    saveButton = () => {
        var titlebox = this.refs.imageDetails.refs.title,
            textarea = this.refs.imageDetails.refs.textarea,
            tags = this.refs.imageDetails.tags,
            imageDetails;
        var oldImage = this.refs.imageDetails.imageToEdit;

        imageDetails = {
            type: FILE_ENTRY.TYPE,
            guid: oldImage.guid,
            title: titlebox.value,
            description: textarea.value,
            tags: tags,
        };

        if (!imageDetails.title) {
            alertify
                .okBtn(this.gettext("alert_ok_button"))
                .alert(this.gettext("edit_image_required"));
            return;
        }

        // Check to make sure it still has the right file extension.
        var fileExtension;
        if (imageDetails.title.lastIndexOf('.') === -1) {
            fileExtension = false;
        }
        else {
            fileExtension = imageDetails.title.substr(imageDetails.title.lastIndexOf('.'));
        }
        switch (oldImage.mimeType) {
            case 'image/jpeg':
                if (fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
                    imageDetails.title = imageDetails.title + '.jpg';
                }
                break;
            case 'image/gif':
                if (fileExtension !== 'gif') {
                    imageDetails.title = imageDetails.title + '.gif';
                }
                break;
            case 'image/png':
                if (fileExtension !== 'png') {
                    imageDetails.title = imageDetails.title + '.png';
                }
        }

        StateStore.dispatch({ type: FILE_ENTRY.EDIT_ENTRY, imageDetails: imageDetails });
        Router.navigate(PAGE_URL.PENDING);
    }
    guidGenerator() {
        return (Math.random() + 1).toString(36).substring(2, 12) + (Math.random() + 1).toString(36).substring(2, 12);
    }
}

export default AddImage;

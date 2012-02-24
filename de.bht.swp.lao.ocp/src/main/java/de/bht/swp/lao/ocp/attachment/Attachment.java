package de.bht.swp.lao.ocp.attachment;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

/**
 * This class represents a file uploaded by a user.
 */
@Entity
@Table(name = "LAO_ATTACHMENT")
public class Attachment extends WhiteboardItem {

    private static final int MYSQL_MEDIUMBLOB_CHAR_SIZE = 16777215;

    private static final int MAX_ATTACHMENT_NAME_LENGTH = 11;

    /**
     * Data of this uploaded file.
     */
    @Lob
    @Column(length = MYSQL_MEDIUMBLOB_CHAR_SIZE)
    private byte[] data;

    /**
     * Filename of this uploaded file.
     */
    private String filename;

    /**
     * ShortDescription for this file.
     */
    private String shortDescription;

    /**
     * A flag, if the file upload is completed.
     */
    private Boolean uploaded;

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFileExtension() {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public int getFileNameLength() {
        int length;
        if (this.filename.lastIndexOf(".") > MAX_ATTACHMENT_NAME_LENGTH) {
            length = MAX_ATTACHMENT_NAME_LENGTH;
        } else {
            length = this.filename.lastIndexOf(".");
        }
        return length;
    }

    public Boolean getUploaded() {
        return uploaded;
    }

    public void setUploaded(Boolean uploaded) {
        this.uploaded = uploaded;
    }
}
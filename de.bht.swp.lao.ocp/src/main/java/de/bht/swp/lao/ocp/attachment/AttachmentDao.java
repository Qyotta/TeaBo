package de.bht.swp.lao.ocp.attachment;

import de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao;

/**
 * Data Access Object to access Attachments.
 */
public class AttachmentDao extends AbstractWhiteboardItemDao<Attachment> {

    /*
     * (non-Javadoc)
     * 
     * @see
     * de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao#getType()
     */
    @Override
    public Class<Attachment> getType() {
        return Attachment.class;
    }

}

package de.bht.swp.lao.ocp.attachment;

import de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao;

public class AttachmentDao extends AbstractWhiteboardItemDao<Attachment> {

    @Override
    public Class<Attachment> getType() {
        return Attachment.class;
    }

}

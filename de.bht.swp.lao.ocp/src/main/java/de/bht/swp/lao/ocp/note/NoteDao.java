package de.bht.swp.lao.ocp.note;

import de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao;

public class NoteDao extends AbstractWhiteboardItemDao<Note> {

    @Override
    public Class<Note> getType() {
        return Note.class;
    }

}

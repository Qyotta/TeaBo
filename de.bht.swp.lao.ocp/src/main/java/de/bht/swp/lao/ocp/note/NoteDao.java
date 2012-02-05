package de.bht.swp.lao.ocp.note;

import de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao;

/**
 * Data access object to access notes.
 * 
 */
public class NoteDao extends AbstractWhiteboardItemDao<Note> {

  /*
   * (non-Javadoc)
   * 
   * @see de.bht.swp.lao.ocp.whiteboarditem.AbstractWhiteboardItemDao#getType()
   */
  @Override
  public Class<Note> getType() {
    return Note.class;
  }

}

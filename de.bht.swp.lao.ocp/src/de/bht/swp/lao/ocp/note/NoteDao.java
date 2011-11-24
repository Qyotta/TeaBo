package de.bht.swp.lao.ocp.note;

import java.util.List;

public interface NoteDao {
	public Note findById(Long id);
	public List<Note> findAll();
	public void save(Note note);
}

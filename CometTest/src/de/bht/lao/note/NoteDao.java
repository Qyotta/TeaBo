package de.bht.lao.note;

import java.util.List;

public interface NoteDao {
	public Note findById(Long id);
	public List<Note> findAll();
	public void save(Note note);
}

package de.bht.swp.lao.ocp.note;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class NoteDaoImpl implements NoteDao {

	private List<Note> notes = new ArrayList<Note>();
	
	@Override
	public Note findById(Long id) {
		for(Note note:notes){
			if(note.getId().equals(id)){
				return note;
			}
		}
		return null;
	}

	@Override
	public List<Note> findAll() {
		return notes;
	}

	@Override
	public void save(Note note) {
		if(note.getId()==null || !update(note)){
			if(notes.size()>0){
				Note last=notes.get(notes.size()-1);
				note.setId(last.getId()+1);
			}else{
				note.setId(new Long(1));
			}
			notes.add(note);
		}
	}
	
	public void saveProgress(Note note) {
		if(note.getId() != null){
			Note found =findById(note.getId());
			found.setInProgress(note.isInProgress());
		}
	}
	
	private boolean update(Note note){
		Note old = findById(note.getId());
		if(old!=null){
			old.setCreator(note.getCreator());
			old.setText(note.getText());
			old.setTitle(note.getTitle());
			old.setX(note.getX());
			old.setY(note.getY());
			return true;
		}else{
			return false;
		}
	}

	@Override
	public List<Note> findAllbyWhiteboardId(Long id) {
		List<Note> found = new ArrayList<Note>();
		for(Note note:notes){
			if(note.getWhiteboard().getId().equals(id)){
				found.add(note);
			}
		}
		return found;
	}

}

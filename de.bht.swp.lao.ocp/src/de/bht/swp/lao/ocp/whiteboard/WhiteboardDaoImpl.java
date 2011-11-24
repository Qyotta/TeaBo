package de.bht.swp.lao.ocp.whiteboard;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class WhiteboardDaoImpl implements WhiteboardDao{
	
	private List<Whiteboard> whiteboards = new ArrayList<Whiteboard>();
	
	public WhiteboardDaoImpl(){
		Whiteboard w = new Whiteboard();
		w.setName("Mockup");
		save(w);
	}
	
	@Override
	public Whiteboard findById(Long id) {
		for(Whiteboard whiteboard:whiteboards){
			if(whiteboard.getId().equals(id)){
				return whiteboard;
			}
		}
		return null;	
	}

	@Override
	public List<Whiteboard> findAll() {
		return whiteboards;
	}

	@Override
	public void save(Whiteboard whiteboard) {
		if(whiteboard.getId()==null || !update(whiteboard)){
			if(whiteboards.size()>0){
				Whiteboard last=whiteboards.get(whiteboards.size()-1);
				whiteboard.setId(last.getId()+1);
			}else{
				whiteboard.setId(new Long(1));
			}
			whiteboards.add(whiteboard);
		}
	}
	
	private boolean update(Whiteboard whiteboard){
		Whiteboard old = findById(whiteboard.getId());
		if(old!=null){
			old.setId(whiteboard.getId());
			old.setName(whiteboard.getName());
			return true;
		}else{
			return false;
		}
	}
	
}

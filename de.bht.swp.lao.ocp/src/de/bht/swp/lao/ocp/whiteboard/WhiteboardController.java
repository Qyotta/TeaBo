package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.note.NoteDao;

@Controller
@RequestMapping(value="/whiteboard/*")
public class WhiteboardController {
	
	@Inject
	private NoteDao noteDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@RequestMapping(value="/view-{whiteboardId}.htm", method=RequestMethod.GET)
	public String view(ModelMap model,HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		List<Note> notes = noteDao.findAll();
		model.addAttribute("notes", notes);
		model.addAttribute("whiteboard",whiteboardDao.findById(whiteboardId));
		model.addAttribute("user", request.getSession().getAttribute("user"));
		return "whiteboard/view";
	}
	
	@RequestMapping(value="/list.htm",method=RequestMethod.GET)
	public String list(ModelMap model,HttpServletRequest request){
		List<Whiteboard> whiteboards = whiteboardDao.findAll();
		model.addAttribute("whiteboards", whiteboards);
		return "whiteboard/list";
	}
	
}

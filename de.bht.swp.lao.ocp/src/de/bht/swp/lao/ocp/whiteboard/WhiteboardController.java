package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.note.NoteDao;

@Controller
@RequestMapping(value="/whiteboard/view-*.htm")
public class WhiteboardController {
	
	@Inject
	private NoteDao noteDao;
	
	@RequestMapping(method=RequestMethod.GET)
	public String view(ModelMap model,HttpServletRequest request){
		List<Note> notes = noteDao.findAll();
		model.addAttribute("notes", notes);
		model.addAttribute("user", request.getSession().getAttribute("user"));
		return "whiteboard/view";
	}
}

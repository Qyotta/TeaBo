package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.note.NoteDao;
import de.bht.swp.lao.ocp.user.User;

@Controller
@RequestMapping(value="/whiteboard/*")
public class WhiteboardController {
	
	@Inject
	private NoteDao noteDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@Autowired
	private WhiteboardCreateValidator whiteboardCreateValidator;
	
	@RequestMapping(value="/view-{whiteboardId}.htm", method=RequestMethod.GET)
	public String view(ModelMap model,HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		model.addAttribute("notes", noteDao.findAllbyWhiteboardId(whiteboardId));
		model.addAttribute("whiteboard",whiteboardDao.findById(whiteboardId));
		model.addAttribute("user", request.getSession().getAttribute("user"));
		return "whiteboard/view";
	}
	
	@RequestMapping(value="/list.htm",method=RequestMethod.GET)
	public String list(ModelMap model,HttpServletRequest request){
		List<Whiteboard> whiteboards = whiteboardDao.findAll();
		model.addAttribute("whiteboards", whiteboards);
		model.addAttribute("createWhiteboardData", new CreateWhiteboardData());
		return "whiteboard/list";
	}
	
	@RequestMapping(value="/list.htm", method = RequestMethod.POST)
	public String onSubmit(@ModelAttribute("createWhiteboardData") CreateWhiteboardData createWhiteboardData, BindingResult result, HttpServletRequest request) {
		createWhiteboardData.setCreator((User)request.getSession().getAttribute("user"));
		whiteboardCreateValidator.validate(createWhiteboardData, result);
		if (result.hasErrors()) {
			return "/user/login.htm";
		} else {
			Whiteboard w = new Whiteboard();
			w.setName(createWhiteboardData.getName());
			whiteboardDao.save(w);
			return "redirect:/whiteboard/view-"+w.getId()+".htm";
		}
	}
}

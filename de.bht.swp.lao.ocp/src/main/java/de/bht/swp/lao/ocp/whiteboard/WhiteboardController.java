package de.bht.swp.lao.ocp.whiteboard;

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

import de.bht.swp.lao.ocp.mailer.MailData;
import de.bht.swp.lao.ocp.mailer.Mailer;
import de.bht.swp.lao.ocp.note.NoteDao;
import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.user.UserDao;

@Controller
@RequestMapping(value="/whiteboard/*")
public class WhiteboardController {
	
	@Inject
	private NoteDao noteDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@Inject
	private UserDao userDao;
	
	@Autowired
	private WhiteboardCreateValidator whiteboardCreateValidator;
	
	@RequestMapping(value="/view-{whiteboardId}.htm", method=RequestMethod.GET)
	public String view(ModelMap model,HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		model.addAttribute("notes", noteDao.findAllbyWhiteboardId(whiteboardId));
		model.addAttribute("whiteboard",whiteboardDao.findById(whiteboardId));
		model.addAttribute("user", request.getSession().getAttribute("user"));
		model.addAttribute("mailaddress", new MailData());
		return "whiteboard/view";
	}
	
	@RequestMapping(value="/delete-{whiteboardId}.htm", method=RequestMethod.GET)
	public String delete(ModelMap model,HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		whiteboardDao.delete(whiteboardDao.findById(whiteboardId));
		User user = (User)request.getSession().getAttribute("user");
		model.addAttribute("user", userDao.findById(user.getId()));
		return "redirect:/whiteboard/list.htm";
	}
	
	@RequestMapping(value="/list.htm",method=RequestMethod.GET)
	public String list(ModelMap model,HttpServletRequest request){
		User user = (User)request.getSession().getAttribute("user");
		user = userDao.findById(user.getId());
		model.addAttribute("createWhiteboardData", new CreateWhiteboardData());
		
		model.addAttribute("whiteboards", user.getWhiteboards());
		model.addAttribute("assignedWhiteboards", user.getAssignedWhiteboards());
		return "whiteboard/list";
	}
	
	@RequestMapping(value="/list.htm", method = RequestMethod.POST)
	public String onSubmit(@ModelAttribute("createWhiteboardData") CreateWhiteboardData createWhiteboardData, BindingResult result, HttpServletRequest request) {
		createWhiteboardData.setCreator((User)request.getSession().getAttribute("user"));
		whiteboardCreateValidator.validate(createWhiteboardData, result);
		if (result.hasErrors()) {
			if(result.hasFieldErrors("name")){
				return "whiteboard/list";
			}
			return "redirect:/user/login.htm";
		} else {
			Whiteboard w = new Whiteboard();
			w.setName(createWhiteboardData.getName());
			w.setCreator(createWhiteboardData.getCreator());
			whiteboardDao.save(w);
			return "redirect:/whiteboard/view-"+w.getId()+".htm";
		}
	}
	
	@RequestMapping(value="/inviteuser-{whiteboardId}.htm", method = RequestMethod.POST)
	public String sendMail(@ModelAttribute("mailaddress") MailData mailData, BindingResult result, HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		String emailAddress = mailData.getAddress();
		
		User invitedUser = userDao.findByEmail(emailAddress);
		
		if(invitedUser==null){
			invitedUser = new User();
			invitedUser.setEmail(emailAddress);
			invitedUser.setPassword("qwertz");
		}
		Whiteboard w = whiteboardDao.findById(whiteboardId);
		invitedUser.addAssignedWhiteboard(w);
		userDao.save(invitedUser);
		new Mailer().sendMessage(invitedUser, w);
		return "redirect:/whiteboard/list.htm";
	}
}

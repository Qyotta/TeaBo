package de.bht.swp.lao.ocp.modules.attachment;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.modules.IWhiteboardItemDao;
import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;
import de.bht.swp.lao.ocp.whiteboard.WhiteboardDao;

@Controller
@RequestMapping(value="/whiteboard/*")
public class AttachmentController {
	@Inject
	private IWhiteboardItemDao attachmentDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@RequestMapping(value="/uploadfile-{whiteboardId}.htm", method = RequestMethod.POST)
	public String sendMail(@ModelAttribute("fileupload") Attachment attachment, BindingResult result, HttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId){
		
		attachment.setCreator((User)request.getSession().getAttribute("user"));
		Whiteboard w = whiteboardDao.findById(whiteboardId);
		attachment.setWhiteboard(w);
		attachment.setX(100);
		attachment.setY(150);
		
		attachmentDao.save(attachment);
		return "redirect:/whiteboard/list.htm";
	}
	
}

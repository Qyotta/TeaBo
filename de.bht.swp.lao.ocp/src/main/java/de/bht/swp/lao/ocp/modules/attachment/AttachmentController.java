package de.bht.swp.lao.ocp.modules.attachment;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

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
	public String sendMail(@RequestParam("data") MultipartFile data, @RequestParam("shortDescription") String shortDescription, MultipartHttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId) throws IOException{
		
		Attachment attachment = new Attachment();
		attachment.setCreator((User)request.getSession().getAttribute("user"));
		Whiteboard w = whiteboardDao.findById(whiteboardId);
		attachment.setWhiteboard(w);
		attachment.setX(100);
		attachment.setY(150);
		attachment.setData(data.getBytes());
		attachment.setFilename(data.getOriginalFilename());
		attachment.setShortDescription(shortDescription);
		attachmentDao.save(attachment);
		return "redirect:/whiteboard/view-"+whiteboardId+".htm";
	}
	
}

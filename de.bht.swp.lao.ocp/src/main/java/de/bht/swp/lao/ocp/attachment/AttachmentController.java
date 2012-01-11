package de.bht.swp.lao.ocp.attachment;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

@Controller
@RequestMapping(value="/attachment/*")
public class AttachmentController {
	@Inject
	private IWhiteboardItemDao<Attachment> attachmentDao;
	
	@RequestMapping(value="/uploadfile-{whiteboardId}.htm", method = RequestMethod.POST)
	public void uploadFile(@RequestParam("data") MultipartFile data, @RequestParam("id") Long id, MultipartHttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId,HttpServletResponse response) throws IOException{
		Attachment attachment = attachmentDao.findById(id);
		User user = (User)request.getSession().getAttribute("user");
		
		attachment.setData(data.getBytes());
		attachment.setFilename(data.getOriginalFilename());
		attachment.setCreator(user);
		attachmentDao.save(attachment);
		
		response.setHeader("Content-type"," application/json");
		String s = "{'id':'"+attachment.getId()+"'}";
		response.getOutputStream().write(s.getBytes());
		response.flushBuffer();
	}
	
	@RequestMapping(value="/{attachmentid}/{filename}/download.htm",method = RequestMethod.GET)
	public void dowloadFile(@PathVariable("attachmentid")Long id, HttpServletResponse response) throws IOException{
		Attachment attachment = (Attachment)attachmentDao.findById(id);
		if(attachment==null){
			//File not found
			throw new FileNotFoundException();
		}
		
		try {
			response.setHeader("Content-Disposition", "attachment; filename="+attachment.getFilename()); 
			response.getOutputStream().write(attachment.getData());
		    response.flushBuffer();
		} 
		catch (IOException e) {
			throw new IOException(e);
		}
	}
}

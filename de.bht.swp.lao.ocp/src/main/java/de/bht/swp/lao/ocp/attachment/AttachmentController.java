package de.bht.swp.lao.ocp.attachment;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

@Controller
@RequestMapping(value="/attachment/*")
public class AttachmentController {
	@Inject
	private IWhiteboardItemDao<Attachment> attachmentDao;
	
	@RequestMapping(value="/uploadfile-{whiteboardId}.htm", method = RequestMethod.POST)
	public @ResponseBody Map<String, ?> uploadFile(@RequestParam("data") MultipartFile data, @RequestParam("id") Long id, MultipartHttpServletRequest request,@PathVariable("whiteboardId")Long whiteboardId) throws IOException{
		System.out.println();
		System.out.println();
		System.out.println("upload");
		System.out.println();
		System.out.println();
		Attachment attachment = attachmentDao.findById(id);
		
		attachment.setData(data.getBytes());
		attachment.setFilename(data.getOriginalFilename());
		
		attachmentDao.save(attachment);
		
//		return "redirect:/whiteboard/view-"+whiteboardId+".htm";
		return Collections.singletonMap("status", "ok");
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

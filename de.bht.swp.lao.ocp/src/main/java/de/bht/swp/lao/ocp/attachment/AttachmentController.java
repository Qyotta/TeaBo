package de.bht.swp.lao.ocp.attachment;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.metadata.HttpHeaders;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.xml.sax.ContentHandler;

import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.WhiteboardDao;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

/**
 * This class handles attachment specific requests.
 * 
 */
@Controller
@RequestMapping(value = "/attachment/*")
public class AttachmentController {
    @Inject
    private IWhiteboardItemDao<Attachment> attachmentDao;
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AttachmentController.class);
    
    /**
     * Handles a file upload. Responses via json.
     * 
     * @param data
     * @param id
     * @param request
     * @param whiteboardId
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/uploadfile-{whiteboardId}.htm", method = RequestMethod.POST)
    // @formatter:off
  public void uploadFile(
      @RequestParam("data") MultipartFile data, 
      @RequestParam("id") Long id,
      MultipartHttpServletRequest request, 
      @PathVariable("whiteboardId") Long whiteboardId, 
      HttpServletResponse response) throws IOException {
  // @formatter:on
        Attachment attachment = attachmentDao.findById(id);
        User user = (User) request.getSession().getAttribute("user");

        String[] allowedMimeTypes = { "application/pdf", "application/msword", "application/x-tika-ooxml",
                "application/vnd.ms-excel", "application/x-tika-ooxml", "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.oasis.opendocument.text", "application/x-vnd.oasis.opendocument.text",
                "application/vnd.oasis.opendocument.presentation", "application/x-vnd.oasis.opendocument.presentation",
                "application/vnd.oasis.opendocument.formula", "application/x-vnd.oasis.opendocument.formula" };
        List<String> mimeTypes = Arrays.asList(allowedMimeTypes);
        ByteArrayInputStream bStream = new ByteArrayInputStream(data.getBytes());
        Boolean validFileType = true;
        try {
            ContentHandler contenthandler = new BodyContentHandler();
            Metadata metadata = new Metadata();
            Parser parser = new AutoDetectParser();
            ParseContext context = new ParseContext();
            parser.parse(bStream, contenthandler, metadata, context);

            // getting MimeType
            if (!mimeTypes.contains(metadata.get(HttpHeaders.CONTENT_TYPE))) {
                LOGGER.info("Not allowed Mime-Type: " + metadata.get(HttpHeaders.CONTENT_TYPE));
                validFileType = false;

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String s;
        if (validFileType) {
            attachment.setData(data.getBytes());
            attachment.setFilename(data.getOriginalFilename());
            attachment.setCreator(user);
            attachmentDao.save(attachment);
            s = "{'id':'" + attachment.getId() + "'}";
        } else {
            attachmentDao.delete(attachment);
            s = "{'error':'invalid FileType', 'id':'" + attachment.getId() + "'}";
        }
        response.setHeader("Content-type", " application/json");
        response.getOutputStream().write(s.getBytes());
        response.flushBuffer();
    }

    /**
     * Handles download requests. Returns the requested file via the output stream of response. 
     * Throws an exception if requested file is not found.
     * 
     * @param id the id of the requested file
     * @param response the http response object
     * @throws IOException
     */
    @RequestMapping(value = "/{attachmentid}/{filename}/download.htm", method = RequestMethod.GET)
    public void dowloadFile(@PathVariable("attachmentid") Long id, HttpServletResponse response) throws IOException {
        Attachment attachment = attachmentDao.findById(id);
        if (attachment == null) {
            throw new FileNotFoundException();
        }

        try {
            response.setHeader("Content-Disposition", "attachment; filename=" + attachment.getFilename());
            response.getOutputStream().write(attachment.getData());
            response.flushBuffer();
        } catch (IOException e) {
            throw new IOException(e);
        }
    }
}

package de.bht.swp.lao.ocp.whiteboard;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import de.bht.swp.lao.ocp.attachment.Attachment;
import de.bht.swp.lao.ocp.auth.IUserDao;
import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.exceptions.OCPHTTPException;
import de.bht.swp.lao.ocp.mailer.InviteMailer;
import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.utils.UserUtilities;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

/**
 * This class handles whiteboard specific requests.
 */
@Controller
@RequestMapping(value = "/whiteboard/*")
public class WhiteboardController {
    @Inject
    private IWhiteboardItemDao<Note> noteDao;

    @Inject
    private IWhiteboardItemDao<Attachment> attachmentDao;

    @Inject
    private IWhiteboardDao whiteboardDao;

    @Inject
    private IUserDao userDao;

    @RequestMapping(value = "/{whiteboardId}", method = RequestMethod.GET)
    public @ResponseBody
    WhiteboardDTO view(HttpServletRequest request,
            @PathVariable("whiteboardId") Long whiteboardId) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);

        if (whiteboard == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_404_NOT_FOUND,
                    "Whiteboard could be found.");
        }

        return new WhiteboardDTO(whiteboard,
                noteDao.findAllbyWhiteboardId(whiteboardId),
                attachmentDao.findAllbyWhiteboardId(whiteboardId));
    }

    private boolean isOwnedByUser(User user, Whiteboard whiteboard) {
        return user.equals(whiteboard.getCreator());
    }

    @RequestMapping(value = "/created", method = RequestMethod.GET)
    public @ResponseBody
    List<WhiteboardDTO> getCreatedWhiteboards(ModelMap model,
            HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        user = userDao.findById(user.getId());

        List<WhiteboardDTO> out = new ArrayList<WhiteboardDTO>();
        for (Whiteboard w : user.getWhiteboards()) {
            out.add(new WhiteboardDTO(w, null, null));
        }
        return out;
    }

    @RequestMapping(value = "/created/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    WhiteboardDTO deleteCreatedWhiteboard(ModelMap model,
            HttpServletRequest request, @PathVariable Long id) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        Whiteboard whiteboard = whiteboardDao.findById(id);

        if (!isOwnedByUser(user, whiteboard)) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    " This Whiteboard is not owned by you.");
        }

        whiteboardDao.delete(whiteboard);

        return new WhiteboardDTO(whiteboard, null, null);
    }

    @RequestMapping(value = "/assigned", method = RequestMethod.GET)
    public @ResponseBody
    List<WhiteboardDTO> assignedWhiteboards(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        user = userDao.findById(user.getId());

        List<WhiteboardDTO> out = new ArrayList<WhiteboardDTO>();
        for (Whiteboard w : user.getAssignedWhiteboards()) {
            out.add(new WhiteboardDTO(w, null, null));
        }
        return out;
    }

    @RequestMapping(value = "/created", method = RequestMethod.POST)
    public @ResponseBody
    WhiteboardDTO create(@RequestBody Whiteboard whiteboard,
            HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        String name = whiteboard.getName();
        if (name == null || name.equals("")) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "Illegal argument: name should be given.");
        }

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "Please login!");
        }

        whiteboard.setCreator(user);
        whiteboardDao.saveOrUpdate(whiteboard);

        return new WhiteboardDTO(whiteboard, null, null);
    }

    /**
     * Invites an user by email address to the whiteboard with whiteboardId.
     * This method sends an email to invited users.
     * 
     * @param mailData
     *            The mailData.
     * @param result
     *            The result.
     * @param request
     *            The request.
     * @param whiteboardId
     *            The id of the whiteboard.
     * @return
     * @return The name of the view to display.
     * @throws IOException
     */
    @RequestMapping(value = "/inviteuser-{whiteboardId}.htm", method = RequestMethod.POST)
    public Map<String, Object> invite(
            @RequestParam("mailData") String mailaddress,
            HttpServletRequest request,
            @PathVariable("whiteboardId") Long whiteboardId,
            HttpServletResponse response) throws IOException {

        User invitedUser = userDao.findByEmail(mailaddress);

        if (invitedUser == null) {
            invitedUser = new User();
            invitedUser.setEmail(mailaddress);
            invitedUser.setPassword(UserUtilities.randomPassword());
        }

        Whiteboard w = whiteboardDao.findById(whiteboardId);
        invitedUser.addAssignedWhiteboard(w);
        userDao.save(invitedUser);
        String hostname = request.getScheme() + "://" + request.getServerName()
                + ":" + request.getServerPort();
        new InviteMailer(hostname, request.getContextPath(), invitedUser, w)
                .sendMessage(invitedUser);

        Map<String, Object> out = new HashMap<String, Object>();
        out.put("success", true);
        return out;
    }
}

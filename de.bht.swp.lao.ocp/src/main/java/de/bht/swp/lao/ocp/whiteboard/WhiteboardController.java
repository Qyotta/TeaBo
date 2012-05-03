package de.bht.swp.lao.ocp.whiteboard;

import java.io.IOException;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.ResponseBody;

import de.bht.swp.lao.ocp.auth.IUserDao;
import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.exceptions.OCPHTTPException;
import de.bht.swp.lao.ocp.mailer.InviteMailer;
import de.bht.swp.lao.ocp.utils.AssignmentHelper;
import de.bht.swp.lao.ocp.utils.UserUtilities;

/**
 * This class handles whiteboard specific requests.
 */
@Controller
public class WhiteboardController {
    public static final String BASE_URL = "/whiteboard";

    public static final String WHITEBOARD_WHITEBOARD_ID = BASE_URL + "/{id}";

    public static final String WHITEBOARD_WHITEBOARD_ID_INVITE = BASE_URL
            + "/invite";

    @Inject
    private IWhiteboardDao whiteboardDao;

    @Inject
    private IAssignmentDAO assignmentDao;

    @Inject
    private IUserDao userDao;

    @RequestMapping(value = WHITEBOARD_WHITEBOARD_ID, method = RequestMethod.GET)
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

        return new WhiteboardDTO(whiteboard);
    }

    private boolean isOwnedByUser(User user, Whiteboard whiteboard) {
        return whiteboard.getOwner().getUser().equals(user);
    }

    @RequestMapping(value = BASE_URL, method = RequestMethod.GET)
    public @ResponseBody
    List<WhiteboardDTO> getAssignments(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        user = userDao.findById(user.getId());

        List<WhiteboardDTO> out = new ArrayList<WhiteboardDTO>();
        
        for (Assignment assignment : user.getAssignments()) {
            out.add(new WhiteboardDTO(assignment.getWhiteboard()));
        }
        
        return out;
    }

    @RequestMapping(value = WHITEBOARD_WHITEBOARD_ID, method = RequestMethod.DELETE)
    public @ResponseBody
    WhiteboardDTO delete(ModelMap model, HttpServletRequest request,
            @PathVariable Long id) {
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

        return new WhiteboardDTO(whiteboard);
    }

    @RequestMapping(value = BASE_URL, method = RequestMethod.POST)
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
        
        whiteboardDao.saveOrUpdate(whiteboard);
        
        Assignment assignment = new Assignment(user, whiteboard, AssignmentHelper.generateColor(),true);

        assignmentDao.saveOrUpdate(assignment);
        whiteboard = whiteboardDao.findById(whiteboard.getId());
        return new WhiteboardDTO(whiteboard);
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
     * @return Map
     * @throws IOException
     */
    @RequestMapping(value = WHITEBOARD_WHITEBOARD_ID_INVITE, method = RequestMethod.POST)
    public void invite(@RequestBody Map<String, Object> data,
            HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String mailaddress = (String) data.get("email");
        Long whiteboardId = Long.valueOf((Integer) data.get("whiteboardId"));
        
        User invitedUser = userDao.findByEmail(mailaddress);
        
        if (invitedUser == null) {
            invitedUser = new User();
            invitedUser.setEmail(mailaddress);
            invitedUser.setPassword(UserUtilities.randomPassword());
        }
        userDao.save(invitedUser);
        
        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);
        
        Assignment assignment = new Assignment(invitedUser, whiteboard, AssignmentHelper.generateColor(),false);
        assignmentDao.saveOrUpdate(assignment);
        
        String hostname = request.getScheme() + "://" + request.getServerName()
                + ":" + request.getServerPort();
        new InviteMailer(hostname, request.getContextPath(), invitedUser, whiteboard)
                .sendMessage(invitedUser);

        String s = "{\"success\":true}";

        response.setHeader("Content-type", " application/json");
        response.getOutputStream().write(s.getBytes());
        response.flushBuffer();
    }
}
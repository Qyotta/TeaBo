package de.bht.swp.lao.ocp.whiteboard;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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

    /**
     * Displays a whiteboard.
     * 
     * @param model
     *            The model.
     * @param request
     *            The request.
     * @param whiteboardId
     *            The id of the requested whiteboard.
     * @return The name of the view to display
     */
    @RequestMapping(value = "/view-{whiteboardId}.htm", method = RequestMethod.GET)
    public String view(ModelMap model, HttpServletRequest request,
            @PathVariable("whiteboardId") Long whiteboardId) {
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            return "redirect:/user/login.htm";
        }

        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);

        if (whiteboard == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_404_NOT_FOUND,
                    " no Whiteboard could be found.");
        }

        model.addAttribute("whiteboard", whiteboard);
        model.addAttribute("notes", noteDao.findAllbyWhiteboardId(whiteboardId));
        model.addAttribute("attachments",
                attachmentDao.findAllbyWhiteboardId(whiteboardId));
        model.addAttribute("user", user);
        return "whiteboard/view";
    }

    /**
     * Deletes the whiteboard by id.
     * 
     * @param model
     *            The model.
     * @param request
     *            The request.
     * @param whiteboardId
     *            The id of the whiteboard to delete.
     * @return The name of the view to display.
     */
    @RequestMapping(value = "/delete-{whiteboardId}.htm", method = RequestMethod.GET)
    public String delete(ModelMap model, HttpServletRequest request,
            @PathVariable("whiteboardId") Long whiteboardId) {
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            return "redirect:/user/login.htm";
        }

        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);

        if (!isOwnedByUser(user, whiteboard)) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    " This Whiteboard is not owned by you.");
        }

        whiteboardDao.delete(whiteboard);
        return "redirect:/whiteboard/list.htm";
    }

    private boolean isOwnedByUser(User user, Whiteboard whiteboard) {
        return user.equals(whiteboard.getCreator());
    }

    @RequestMapping(value = "/created", method = RequestMethod.GET)
    public @ResponseBody
    Set<Map<String, Object>> getCreatedWhiteboards(ModelMap model,
            HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        user = userDao.findById(user.getId());

        model.addAttribute("whiteboards", user.getWhiteboards());
        Set<Whiteboard> whiteboards = user.getWhiteboards();
        Set<Map<String, Object>> out = new HashSet<Map<String, Object>>();
        for (Whiteboard w : whiteboards) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("id", w.getId());
            map.put("name", w.getName());
            out.add(map);
        }
        return out;
    }

    @RequestMapping(value = "/created/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    Map<String, Object> deleteCreatedWhiteboard(ModelMap model,
            HttpServletRequest request, @PathVariable Long id) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        // user = userDao.findById(user.getId());

        Whiteboard w = whiteboardDao.findById(id);
        whiteboardDao.delete(w);
        Map<String, Object> out = new HashMap<String, Object>();
        out.put("id", w.getId());

        System.out.println("deleted whiteboard: " + w.getId());
        return out;
    }

    @RequestMapping(value = "/assigned", method = RequestMethod.GET)
    public @ResponseBody
    Set<Map<String, Object>> assignedWhiteboard(ModelMap model,
            HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "You are not authorized, please login!");
        }

        user = userDao.findById(user.getId());

        model.addAttribute("whiteboards", user.getWhiteboards());
        Set<Whiteboard> whiteboards = user.getAssignedWhiteboards();
        Set<Map<String, Object>> out = new HashSet<Map<String, Object>>();
        for (Whiteboard w : whiteboards) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("id", w.getId());
            map.put("name", w.getName());
            out.add(map);
        }
        return out;
    }

    @RequestMapping(value = "/created", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, ? extends Object> create(@RequestBody Whiteboard whiteboard,
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
        Map<String, Object> out = new HashMap<String, Object>();
        out.put("id", whiteboard.getId());
        out.put("name", whiteboard.getName());
        return out;
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

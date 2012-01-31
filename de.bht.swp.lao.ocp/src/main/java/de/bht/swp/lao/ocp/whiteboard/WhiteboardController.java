package de.bht.swp.lao.ocp.whiteboard;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import de.bht.swp.lao.ocp.attachment.Attachment;
import de.bht.swp.lao.ocp.exceptions.OCPHTTPException;
import de.bht.swp.lao.ocp.mailer.MailData;
import de.bht.swp.lao.ocp.mailer.Mailer;
import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.usermanagement.IUserDao;
import de.bht.swp.lao.ocp.usermanagement.User;
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
    public String view(ModelMap model, HttpServletRequest request, @PathVariable("whiteboardId") Long whiteboardId) {
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            return "redirect:/user/login.htm";
        }

        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);

        if (whiteboard == null) {
            throw new OCPHTTPException(OCPHTTPException.HTTPCode.HTTP_404_NOT_FOUND, " no Whiteboard could be found.");
        }

        model.addAttribute("whiteboard", whiteboard);
        model.addAttribute("notes", noteDao.findAllbyWhiteboardId(whiteboardId));
        model.addAttribute("attachments", attachmentDao.findAllbyWhiteboardId(whiteboardId));
        model.addAttribute("user", user);
        model.addAttribute("mailaddress", new MailData());
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
    public String delete(ModelMap model, HttpServletRequest request, @PathVariable("whiteboardId") Long whiteboardId) {
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            return "redirect:/user/login.htm";
        }

        Whiteboard whiteboard = whiteboardDao.findById(whiteboardId);

        if (!isOwnedByUser(user, whiteboard)) {
            throw new OCPHTTPException(OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    " This Whiteboard is not owned by you.");
        }

        whiteboardDao.delete(whiteboard);
        return "redirect:/whiteboard/list.htm";
    }

    private boolean isOwnedByUser(User user, Whiteboard whiteboard) {
        return user.equals(whiteboard.getCreator());
    }

    /**
     * Displays a list of whiteboards created by the actual user and users
     * assigned whiteboards.
     * 
     * @param model
     *            The model.
     * @param request
     *            The request.
     * @return The name of the view to display.
     */
    @RequestMapping(value = "/list.htm", method = RequestMethod.GET)
    public String list(ModelMap model, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        user = userDao.findById(user.getId()); // in session there is only a
                                               // copy, u need the obj from the
                                               // db instead

        if (user == null) {
            return "redirect:/user/login.htm";
        }

        model.addAttribute("whiteboards", user.getWhiteboards());
        model.addAttribute("assignedWhiteboards", user.getAssignedWhiteboards());
        return "whiteboard/list";
    }

    /**
     * Creates a named whiteboard. If the name is null, the user will be
     * redirected to the login site.
     * 
     * @param name
     *            Name of the whiteboard.
     * @param request
     *            The request.
     * @return The name of the view to display.
     */
    @RequestMapping(value = "/list.htm", method = RequestMethod.POST)
    public String create(@RequestParam("name") String name, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");

        if (name == null || name.equals("")) {
            return "redirect:/whiteboard/list.htm";
        }

        if (user == null) {
            return "redirect:/user/login.htm";
        }

        Whiteboard w = new Whiteboard();
        w.setName(name);
        w.setCreator(user);
        whiteboardDao.saveOrUpdate(w);

        return "redirect:/whiteboard/view-" + w.getId() + ".htm";
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
     * @return The name of the view to display.
     */
    @RequestMapping(value = "/inviteuser-{whiteboardId}.htm", method = RequestMethod.POST)
    public String invite(@ModelAttribute("mailaddress") MailData mailData, BindingResult result,
            HttpServletRequest request, @PathVariable("whiteboardId") Long whiteboardId) {
        String emailAddress = mailData.getAddress();

        User invitedUser = userDao.findByEmail(emailAddress);

        if (invitedUser == null) {
            invitedUser = new User();
            invitedUser.setEmail(emailAddress);
            invitedUser.setPassword(Mailer.randomPassword());
        }

        Whiteboard w = whiteboardDao.findById(whiteboardId);
        invitedUser.addAssignedWhiteboard(w);
        userDao.save(invitedUser);
        String hostname = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        new Mailer(hostname, request.getContextPath()).sendMessage(invitedUser, w);

        return "redirect:/whiteboard/list.htm";
    }
}

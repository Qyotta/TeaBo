package de.bht.swp.lao.ocp.app;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.user.UserDTO;

@Controller
public class AppController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String view(ModelMap model, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        model.addAttribute("user", user != null ? new UserDTO(user) : null);
        return "/app/view";
    }
}

package de.bht.swp.lao.ocp.app;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.auth.User;

@Controller
public class AppController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String register(ModelMap model, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        // if (user == null) {
        // return "redirect:/user/login.htm";
        // }
        // model.addAttribute("user", user);
        return "/app/view";
    }
}

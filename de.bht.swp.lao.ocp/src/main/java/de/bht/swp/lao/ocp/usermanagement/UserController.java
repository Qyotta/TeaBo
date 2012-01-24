package de.bht.swp.lao.ocp.usermanagement;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/user/*")
public class UserController {

  @Autowired
  private UserLoginValidator userLoginValidator;

  @Inject
  private IUserDao userDao;

  @RequestMapping(value = "/setToolTipFlag.htm", method = RequestMethod.POST)
  public void setFlag(@RequestParam("value") boolean value, HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    user.setShowToolTips(!value);
    userDao.save(user);

    response.setHeader("Content-type", "application/json");
    response.getOutputStream().write("{value:'1'}".getBytes());
    response.flushBuffer();
  }

  @RequestMapping(value = "/showAgain.htm", method = RequestMethod.POST)
  public void getFlag(HttpServletRequest request, HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    response.setHeader("Content-type", "application/json");
    String json = "{ value: '" + user.isShowToolTips() + "' }";
    response.getOutputStream().write(json.getBytes());
    response.flushBuffer();
  }

  // Set set current Session invalid and redirect to login.jsp
  @RequestMapping(value = "/logout.htm", method = RequestMethod.POST)
  public ModelAndView onSubmit(@ModelAttribute("loginFormData") LoginFormData loginFormData, BindingResult result,
      HttpServletRequest request) {
    ModelAndView mav = new ModelAndView();
    request.getSession().invalidate();
    mav.setViewName("user/login");
    return mav;
  }

  // if login.htm is called - Get
  @RequestMapping(value = "/login.htm", method = RequestMethod.GET)
  public String view(ModelMap model, HttpServletRequest request) {

    User user = (User) request.getSession().getAttribute("user");

    // if user session already valid, redirect to list.html
    if (user != null) {
      return "redirect:/user/list.htm";
    }
    model.addAttribute("loginFormData", new LoginFormData());

    return "user/login";
  }

  // if login button clicked - Post
  @RequestMapping(value = "/login.htm", method = RequestMethod.POST)
  public String login(ModelMap model, @ModelAttribute("loginFormData") LoginFormData loginFormData,
      BindingResult result, HttpServletRequest request) {
    userLoginValidator.validate(loginFormData, result);

    if (result.hasErrors()) {
      model.addAttribute("errors", result);
      return "user/login";
    } else {
      request.getSession().setAttribute("user", userDao.findByEmail(loginFormData.getEmail()));
      return "redirect:/whiteboard/list.htm";
    }
  }

}

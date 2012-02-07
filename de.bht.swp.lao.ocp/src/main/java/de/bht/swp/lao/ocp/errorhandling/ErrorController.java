package de.bht.swp.lao.ocp.errorhandling;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Handles HTTP errors.
 */
@Controller
public class ErrorController {

  /**
   * Displays a custom error page for HTTP errors.
   * 
   * @param map
   *          the ModelMap
   * @param httpstatus
   *          the http status error code to display
   * @return
   */
  @RequestMapping(value = "/error/{httpstatus}.htm")
  public String handleError(ModelMap map, @PathVariable(value = "httpstatus") Integer httpstatus) {
    map.addAttribute("httpStatus", httpstatus);
    return "error/error";
  }
}
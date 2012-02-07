package de.bht.swp.lao.ocp.errorhandling;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * Handles all thrown exceptions.
 */
public class SimpleExceptionHandler implements HandlerExceptionResolver {

  /*
   * (non-Javadoc)
   * 
   * @see
   * org.springframework.web.servlet.HandlerExceptionResolver#resolveException
   * (javax.servlet.http.HttpServletRequest,
   * javax.servlet.http.HttpServletResponse, java.lang.Object,
   * java.lang.Exception)
   */
  @Override
  public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object obj, Exception e) {
    return new ModelAndView("exception/exception", "exception", e);
  }

}

package de.bht.swp.lao.ocp.user;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value="/user/*")
public class UserController {

	@Inject
	private IUserDao userDao;
	
	@RequestMapping(value="/setToolTipFlag.htm", method=RequestMethod.POST)
	public void setFlag(@RequestParam("value") boolean value,HttpServletRequest request,HttpServletResponse response) throws IOException {
		User user = (User)request.getSession().getAttribute("user");
		
		user.setShowToolTips(!value);
		userDao.save(user);
		
		response.setHeader("Content-type","application/json"); 
		response.getOutputStream().write("{value:'1'}".getBytes());
		response.flushBuffer();
	}
	
	@RequestMapping(value="/showAgain.htm", method=RequestMethod.POST)
	public void getFlag(HttpServletRequest request,HttpServletResponse response) throws IOException {
		User user = (User)request.getSession().getAttribute("user");
		
		response.setHeader("Content-type","application/json");
		String json = "{ value: '"+user.isShowToolTips()+"' }";
		response.getOutputStream().write(json.getBytes());
		response.flushBuffer();
	}
}

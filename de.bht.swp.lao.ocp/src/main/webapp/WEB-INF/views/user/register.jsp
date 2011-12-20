<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
    
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>User register</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/json2.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/org/cometd.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery.cometd.js"></script>
    <script src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>
    
    <script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>

<body>
	<h2>Register</h2>	
		<form:form name="registerFormData" method="POST" commandName="registerFormData" action="register.htm">
		<FONT color="red"><form:errors path="errors" cssClass="error"/></FONT><br /><br />
	
		*Email: <form:errors path="email" cssClass="registerError"/><br />
		<form:input path="email"/><br /><br />
 
		*Password: <form:errors path="password" cssClass="registerError"/><br />
		<form:password path="password"/><br /><br />
		
		*Confirm Password: <form:errors path="passwordvalidate" cssClass="registerError"/><br />
		<form:input path="passwordvalidate"/><br /><br />
		
		Firstname: <form:errors path="firstname" cssClass="registerError"/><br />
		<form:input path="firstname"/><br /><br />
 
		Lastname: <form:errors path="lastname" cssClass="registerError"/><br />
		<form:input path="lastname"/><br /><br />
		
		Position: <form:errors path="position" cssClass="registerError"/><br />
		<form:input path="position"/><br /><br />
		
		<p>* is required</p>
 
 		<p><a href="${pageContext.request.contextPath}/user/login.htm">Cancel</a></p>	
 		<input type="submit" value="Submit">
 		
	
		</form:form>
</body>
</html>
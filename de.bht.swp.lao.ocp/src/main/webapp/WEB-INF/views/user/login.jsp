<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en">
<!--<![endif]-->

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>User login</title>
<meta name="description" content="">
<meta name="author" content="">
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/style.css" />

<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script type="text/javascript"
	src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/libs/jquery/json2.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/libs/org/cometd.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/libs/jquery/jquery.cometd.js"></script>
<script
	src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>



<script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>

<body>
	<nav class="topNavigation">
		<h1>
			<a href="${pageContext.request.contextPath}/user/login.htm"><img
				src="../images/lao_logo.jpg" /></a>
		</h1>
	</nav>

	<div class="loginContainer">

		<form:form name="loginFormData" modelAttribute="loginFormData"
			method="POST" commandName="loginFormData" action="login.htm">
			
			<h1>Welcome to [lao] - Please Login</h1>
			<form:errors path="errors" cssClass="error" />
            <form:errors path="email" cssClass="error" />
            <form:errors path="password" cssClass="error" />

			<dl>
				<dt>Email:</dt>
				<dd>
					<form:input type="email" path="email" />
				</dd>
				<dt>Password:</dt>
				<dd>
					<form:password path="password" />
				</dd>

				<dt>
					<a href="${pageContext.request.contextPath}/user/register.htm">Create
						Account</a>
				</dt>
				<dd>

					<input type="submit" value="Login">
				</dd>

			</dl>

		</form:form>

	</div>
	<nav class="bottomNavigation"></nav>

</body>
</html>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

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
<title>User register</title>
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
<script src="${pageContext.request.contextPath}/js/errordisplay.js"></script>

<script type="text/javascript">
	var config = {
		contextPath : '${pageContext.request.contextPath}'
	};
</script>

</head>

<body>
	<nav class="topNavigation">
		<h1>
			<a href="${pageContext.request.contextPath}/user/login.htm"><img
				src="../images/lao_logo.jpg" /> </a>
		</h1>
	</nav>


	<div class="registerContainer">

		<h1>
			<img src="../images/lao_register.png" />
		</h1>

		<h2>Registration</h2>
		<h3>Fields with * are required.</h3>

		<form:form name="registerFormData" method="POST"
			commandName="registerFormData" action="register.htm">

			</br>

			<dl>
				<dt>E-Mail Address*</dt>
				<dd>
					
					<c:set var="emailErrors">
						<form:errors path="email" element="div" />
					</c:set>
					<c:choose>
						<c:when test="${not empty emailErrors}">
						<form:input path="email"  cssClass="wrongfield"/>
							<div class="exclamation">
								<img src="../images/exclamation_mark.png">
								<div class="errors">${emailErrors}</div>
							</div>
						</c:when>
						<c:otherwise>
							<form:input path="email" />
						</c:otherwise>
					</c:choose>


				</dd>
				<dt>Choose Password*</dt>
				<dd>
					
					<c:set var="passwordErrors">
						<form:errors path="password" element="div" />
					</c:set>
					<c:choose>
						<c:when test="${not empty passwordErrors}">
							<form:password path="password" cssClass="wrongfield"/>
							<div class="exclamation">
								<img src="../images/exclamation_mark.png">
								<div class="errors">${passwordErrors}</div>
							</div>
						</c:when>
						<c:otherwise>
							<form:password path="password"/>
						</c:otherwise>
					</c:choose>
				</dd>
				<dt>Confirm Password*</dt>
				<dd>
					<c:set var="passwordValidateErrors">
						<form:errors path="passwordvalidate" element="div" />
					</c:set>
					<c:choose>
						<c:when test="${not empty passwordValidateErrors}">
							<form:password path="passwordvalidate"  cssClass="wrongfield"/>
							<div class="exclamation">
								<img src="../images/exclamation_mark.png">
								<div class="errors">${passwordValidateErrors}</div>
							</div>
						</c:when>
						<c:otherwise>
							<form:password path="passwordvalidate" />
						</c:otherwise>
					</c:choose>
				</dd>
				<dt>First Name</dt>
				<dd>
					<form:input path="firstname" />
				</dd>
				<dt>Last Name</dt>
				<dd>
					<form:input path="lastname" />
				</dd>
				<dt>
					Position
					<h4>(e.g. Project Manager)</h4>
				</dt>
				<dd>
					<form:input path="position" />
				</dd>
			</dl>

			<div class="registerCancelButtons">

				<input type="submit" value="Register Now" class="submitButton">

				<a href="${pageContext.request.contextPath}/user/login.htm"> <input
					type="button" value="Cancel" class="submitButton"> </a>

			</div>

			<!--  <div class="exclamation_mark">
				
			</div>-->
	</div>

	</form:form>
	<nav class="bottomNavigation"></nav>
</body>
</html>
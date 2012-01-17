<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]> <html class="no-js" lang="en">           <![endif]-->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>[lao] - Online Collaboration Platform</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/json2.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/org/cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery.cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/application.js"></script>
<script type="text/javascript">var config = {contextPath : '${pageContext.request.contextPath}'}</script>

<nav class="topNavigation">
    <h1 class="logo">
        <a href="${pageContext.request.contextPath}/user/login.htm">
            <span><c:out value='${whiteboard.name}'/><br/><b>lao (V 0.1a)</b></span>
        </a>
    </h1>
    <div class="right">
        <div>
            <a href="../user/login.htm">Log out</a>
        </div>
        <div>
            <b>User:</b><c:out value="${user.email}"/>
        </div>
    </div>
</nav>

<div class="rightNavigation">
	<a class="slideLeftButton"><img src="../images/slide_button.png"></a>
</div>
	
<div class="mainPanel">
	<h2>Create Whiteboard</h2>
	<form:form method="post">
	Name: <br />
		<input name="name" />
		<br />
		<input type="submit" value="Submit">
	</form:form>
	<h2>Created Whiteboards</h2>
	<c:choose>
		<c:when test="${fn:length(whiteboards) == 0}">
			<p>No whiteboard created yet.</p>
		</c:when>
		<c:otherwise>
			<ul>
				<c:forEach var="whiteboard" items="${whiteboards}">
					<li><a
						href="${pageContext.request.contextPath}/whiteboard/view-<c:out value="${whiteboard.id}"/>.htm"><c:out
								value="${whiteboard.name}" /> </a> <a
						href="${pageContext.request.contextPath}/whiteboard/delete-<c:out value="${whiteboard.id}"/>.htm">Delete</a>
					</li>
				</c:forEach>
			</ul>
		</c:otherwise>
	</c:choose>

	<h2>Assigned whiteboards</h2>
	<c:choose>
		<c:when test="${fn:length(assignedWhiteboards) == 0}">
			<p>No whiteboard assigned yet.</p>
		</c:when>
		<c:otherwise>
			<ul>
				<c:forEach var="whiteboard" items="${assignedWhiteboards}">
					<li><a
						href="${pageContext.request.contextPath}/whiteboard/view-<c:out value="${whiteboard.id}"/>.htm"><c:out
								value="${whiteboard.name}" /> </a></li>
				</c:forEach>
			</ul>
		</c:otherwise>
	</c:choose>
</div>  

<nav class="bottomNavigation"></nav>
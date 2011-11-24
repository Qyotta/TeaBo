<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
    
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
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
    
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/application.js"></script>
    <script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>
<body>
<h2>Create Whiteboard</h2>
<form:form method="post" commandName="createWhiteboardData">
		<form:errors path="errors" cssClass="error"/><br/>
		Name: <form:errors path="name" cssClass="error"/><br />
		<form:input path="name"/><br/>
		<input type="submit" value="Submit">
	</form:form>
<ul>
<h2>Whiteboard List</h2>
<c:forEach var="whiteboard" items="${whiteboards}">
		<li><a href="${pageContext.request.contextPath}/whiteboard/view-<c:out value="${whiteboard.id}"/>.htm"><c:out value="${whiteboard.name}"/></a></li>
</c:forEach>
</ul>
</body>
</html>
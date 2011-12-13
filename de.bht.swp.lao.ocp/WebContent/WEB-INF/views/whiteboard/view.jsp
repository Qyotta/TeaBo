<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>[lao] - Online Collaboration Platform</title>
<meta name="description" content="">
<meta name="author" content="">
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />

<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/json2.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/org/cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/jquery/jquery.cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/application.js"></script>

<h1>Whiteboard <c:out value='${whiteboard.name}'/>(logged in as <c:out value="${user.email}"/>)</h1>

<form:form method="post" commandName="mailaddress" action="inviteuser-${whiteboard.id}.htm">
	Mail: <form:input path="address"/><br/>
	<input type="submit" value="Submit">
</form:form>
	
<div class="whiteboard" data-context-path="${pageContext.request.contextPath}" data-user-mail="${user.email}" data-whiteboard-id="${whiteboard.id}">
	<c:forEach var="note" items="${notes}">
		<div class="postIt" id="postIt-<c:out value="${note.id}"/>" style="left:<c:out value="${note.x}"/>px; top:<c:out value="${note.y}"/>px;">
			<input type="text" name="title" value="<c:out value='${note.title}'/>"/>
			<textarea name="text"><c:out value='${note.text}'/></textarea>
			<span class="creator"><c:out value='${note.creator.email}'/></span>
		</div>
	</c:forEach>
</div>

<nav class="bottomNavigation">
    <ul>
        <li><a href="#"><img src="../images/icons/pin_map.png" alt="Get URL" title="Get URL" /></a></li>
        <li><a href="#"><img src="../images/icons/zoom.png" alt="Search" title="Search" /></a></li>
    </ul>

    <ul class="right">
        <li><a href="#"><img src="../images/icons/calendar.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/chart_line.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/checkbox_checked.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/doc_empty.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/music.png" alt="Search" title="Search" /></a></li>
        <li><a href="#" class="createPostIt"><img src="../images/icons/notepad.png" alt="create_postIt" title="create new postIt" /></a></li>
        <li><a href="#"><img src="../images/icons/pencil.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/picture.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/preso.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/spechbubble_sq_line.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="../images/icons/tag.png" alt="Search" title="Search" /></a></li>
    </ul>
</nav> 
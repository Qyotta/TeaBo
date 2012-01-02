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
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/application.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/whiteboard-view.js"></script>

<script type="text/javascript">
$(document).ready(function() {
	var basePath = "${pageContext.request.contextPath}";
	showStartHelp();
});
</script>

</head>
<body>
<h1>Whiteboard <c:out value='${whiteboard.name}'/>(logged in as <c:out value="${user.email}"/>)</h1>

<form:form method="post" commandName="mailaddress" action="inviteuser-${whiteboard.id}.htm">
	Mail: <form:input path="address"/><br/>
	<input type="submit" value="Submit">
</form:form>

<div id="upload-dialog" >	
<form:form method="post" enctype="multipart/form-data" commandName="fileupload" action="${pageContext.request.contextPath}/attachment/uploadfile-${whiteboard.id}.htm">
	<ul> 
		<li>File: <input type="file" name="data"> 
		Description<br />
		<textarea name="shortDescription"></textarea></li>
	</ul> <!-- <button type="button">+</button><br/> -->
	<input type="submit" value="Submit"> 
</form:form>
</div>

<div id="startscreen">
	<input type="button" id="prev" value="prev" />
	<ul>
		<li>Info 1234</li>
		<li>Fooabdeewfewf</li>
		<li>edjewidjewiodjdwe</li>
	</ul>
	<input type="button" id="next" value="next" />
	<div class="fixed-bottom">
		<input type="checkbox" name="showAgain" id="showAgain" value="1" checked="checked"/> Show this again 
		<input type="button" id="showClose" value="close" />
	</div>
</div>

<div class="whiteboard" data-context-path="${pageContext.request.contextPath}" data-user-mail="${user.email}" data-whiteboard-id="${whiteboard.id}">
	<c:forEach var="note" items="${notes}">
		<div class="note" id="note-<c:out value="${note.id}"/>" style="left:<c:out value="${note.x}"/>px; top:<c:out value="${note.y}"/>px;">
			<textarea name="text"><c:out value='${note.text}'/></textarea>
			<span class="creator"><c:out value='${note.creator.email}'/></span>
		</div>
	</c:forEach>
	<c:forEach var="attachment" items="${attachments}">
		<div class="note" id="attachment-<c:out value="${attachment.id}"/>" style="left:<c:out value="${attachment.x}"/>px; top:<c:out value="${attachment.y}"/>px;">
			<p><img src="${pageContext.request.contextPath}/images/teambox-free-file-icons/32px/${attachment.fileExtension}.png"></p>
			<p>${attachment.filename}
				<a href="${pageContext.request.contextPath}/attachment/${attachment.id}/${attachment.filename}/download.htm">download</a>
			</p>
			<textarea name="text"><c:out value='${attachment.shortDescription}'/></textarea>
			<span class="creator"><c:out value='${attachment.creator.email}'/></span>
		</div>
	</c:forEach>
</div>

<nav class="bottomNavigation">
    <ul>
        <li><a href="#"><img src="../images/icons/pin_map.png" alt="Get URL" title="Get URL" /></a></li>
        <li><a href="#"><img src="../images/icons/zoom.png" alt="Search" title="Search" /></a></li>
    </ul>

    <ul class="right">
        <li><a href="#" class="uploadFile"><img src="../images/icons/doc_empty.png" alt="uploadFile" title="Load File" /></a></li>
        <li><a href="#" class="createNote"><img src="../images/icons/notepad.png" alt="create_note" title="create new note" /></a></li>
	</ul>
</nav>
</body>
</html> 
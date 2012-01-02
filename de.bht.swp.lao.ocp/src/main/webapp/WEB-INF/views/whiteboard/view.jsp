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
<script type="text/javascript" src="${pageContext.request.contextPath}/js/tooltip.js"></script>

<script type="text/javascript">
$(document).ready(function() {
	var basePath = "${pageContext.request.contextPath}";
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
	<div class="lightbox" data-type="tooltip">
	    <h1>Hallo und Willkommen zu [lao]</h1>
	    [lao] (look ahead online) ist ein Online-Collaboration-Tool mit dem Sie die Möglichkeit haben mit
	    Ihren Freunden oder Kollegen interaktiv eine Idee oder ein Projekt in Echtzeit zu entwickeln.<br/>
        <br/>
        Es stehen Ihnen dabei eine Vielzahl von Möglichkeiten zur Verfügung ihre Idee zu präsentieren,
        ob über eine Note oder einem Bild. Ihr interaktives Whiteboard, auf dem Sie arbeiten, verhält
        sich dabei wie ein echtes Whiteboard! Sobald Sie etwas darauf packen, werden es alle
        eingeladenen User sofort sehen können!<br/>
        <br/>
        Besuchen Sie unsere interaktive Tour, wo Sie alle wichtigen Optionen des Whiteboards
        kennenlernen und sich so schnell einen Überblick über die Möglichkeiten des Tools machen können.<br/>
        <br/>
        Viel Spaß bei der Nutzung des Tools!<br/>
        <br/>        
        <input type="button" class="closeToolTip" value="Fenster schließen" />
        <input type="button" class="nextToolTip" value="Tour starten" />
        
	    <div class="showAgain">
	        <input type="checkbox" name="showAgain" id="showAgain" value="1" checked="checked"/> Don't show this again!
	    </div>       
	</div>
	<div class="bubble" id="createNote" data-type="tooltip">
	    <img src="${pageContext.request.contextPath}/images/tooltips/bottom-right.png" class="bottom" style="left:260px" />
	    <button class="closeToolTip" />X</button>
	    <h2>Note erstellen</h2>
        Beim Klicken auf dieses Symbol (Bild) wird Ihnen eine Note auf dem Whiteboard erzeugt. Sie
        können danach diese Note beliebig mit Inhalt füllen, verschieben, vergrößern oder gar löschen.
        Alle Notes auf dem Whiteboard können von jedem Benutzer verändert werden. Jeder hat die gleichen
        Rechte! Die einzige Ausnahme ist, wenn eine Note gerade von einem anderen Benutzer bearbeitet
        wird, ist sie für andere User nicht änderbar.
        <br/>
        <input type="button" class="nextToolTip" value="Weiter" />
        <input type="button" class="prevToolTip" value="Zurück" />
	</div>
	<div class="bubble" id="uploadFile" data-type="tooltip">
	    <img src="${pageContext.request.contextPath}/images/tooltips/bottom-right.png" class="bottom" style="left:260px" />
	    <button class="closeToolTip" />X</button>
	    <h2>Datei hochladen</h2>
        Sie haben auch die Möglichkeit auf dem Whiteboard Dateien zu platzieren. Klicken sie dafür auf
        folgendes Symbol (Bild). Ein kleines Fenster öffnet sich, wo Sie die Datei angeben können, die
        hochgeladen werden soll (Bild vom Fenster). Folgende Dateitypen sind erlaubt: PDF, DOC, DOCx,
        XLS, PPT, PPTx, ODP, ODF. Nach dem Upload wird ein kleines Symbol sichtbar, welches genauso wie
        eine Note verschoben und angeordnet werden kann.
        <br/>
        <input type="button" class="nextToolTip" value="Weiter" />
        <input type="button" class="prevToolTip" value="Zurück" />
	</div>
	<div class="bubble" id="inviteUser" data-type="tooltip">
	    <img src="${pageContext.request.contextPath}/images/tooltips/top-right.png" class="top" style="left:20px" />
        <button class="closeToolTip" />X</button>
        <h2>User zum Whiteboard einladen</h2>
	    Um auch wirklich collaborativ arbeiten zu können, brauchen wir nur noch mehrere Benutzer, die
	    auf das Whiteboard Zugriff haben. Laden Sie doch dazu einfach Ihren Freund oder Kollegen ein!
	    Mit dem "Benutzer hinzufügen" Formular (Bild) geht das ganz einfach. Geben Sie dazu die
	    Emailadresse an, mit der die Person bei [lao] angemeldet ist. Ist er dies noch nicht, wird er
	    automatisch vom System hinzugefügt und kann das Tool sofort nutzen.
        <br/>
        <input type="button" class="nextToolTip" value="Weiter" />
        <input type="button" class="prevToolTip" value="Zurück" />
	</div>
	<div class="lightbox" data-type="tooltip">
	    <h1>Tour beendet!</h1>
	    Unsere interaktive Tour ist nun zuende. Viel Spaß mit Ihrem Whiteboard
	    <br/>
	    <input type="button" class="closeToolTip" value="Fenster schließen" />
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
        <li><a href="#" class="showToolTips"><img src="../images/icons/info.png" alt="Show Tooltips" title="Show Tooltips" /></a></li>
    </ul>

    <ul class="right">
        <li><a href="#" class="uploadFile"><img src="../images/icons/doc_empty.png" alt="uploadFile" title="Load File" /></a></li>
        <li><a href="#" class="createNote"><img src="../images/icons/notepad.png" alt="create_note" title="create new note" /></a></li>
	</ul>
</nav>
</body>
</html> 
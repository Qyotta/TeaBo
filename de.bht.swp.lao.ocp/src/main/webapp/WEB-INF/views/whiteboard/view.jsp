<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

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

<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>

<script src="${pageContext.request.contextPath}/js/libs/org/cometd.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery.cometd.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/jquery/json2.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery.elasticArea.js"></script>

<script src="${pageContext.request.contextPath}/js/tooltip.js"></script>
<script src="${pageContext.request.contextPath}/js/whiteboard.js"></script>
<script src="${pageContext.request.contextPath}/js/note.js"></script>
<script src="${pageContext.request.contextPath}/js/attachment.js"></script>
<script src="${pageContext.request.contextPath}/js/application.js"></script>
<script src="${pageContext.request.contextPath}/js/cometd.js"></script>

<script type="text/javascript">$(document).ready(function() {var basePath = "${pageContext.request.contextPath}"});</script>

<nav class="topNavigation">
    <h1 class="logo">
        <a href="${pageContext.request.contextPath}/user/login.htm">
            <span><c:out value='${whiteboard.name}'/><br/><b>lao (V 0.1a)</b></span>
        </a>
    </h1>
    <div class="right">
        <div>
            <a href="invite">Invite a person</a>
            <a href="list.htm">Back to Main Panel</a>
            <a href="logout">Log out</a>
        </div>
        <div>
            <b>User:</b><c:out value="${user.email}"/>
        </div>
    </div>
</nav>

<div class="rightNavigation">
    <a class="slideLeftButton"><img src="../images/slide_button.png"></a>
</div>

<div id="logoutContainer"> 
    Are you sure you want to logout?
    <div class="logout-button"> 
        <form:form method="post" action="${pageContext.request.contextPath}/user/logout.htm">
        <input type="submit" value="Yes">
        <button type="button" class="cancel">No</button>
        </form:form>
    </div>
</div>

<div id="inviteContainer" title="Invite a person">
    <h1>
        Invite a Person
        <span>Enter a Email adress</span>
    </h1>
    <form:form method="post" commandName="mailaddress" action="inviteuser-${whiteboard.id}.htm">
    Mail: <form:input path="address"/><br/>
    <div class="buttonline" >
        <input type="submit" value="Submit">
        <button type="button" class="cancel">Cancel</button>
    </div>
</form:form>

</div>

<div id="uploadContainer">
    <h1>
        Upload a File
        <span>Supported file types are PDF, DOC, DOCx, XLS, PPT, PPTx, ODP, ODF</span>
    </h1>
    <iframe name="uploadFrame" id="uploadFrame" style="display:none"></iframe>
    <form:form method="post" enctype="multipart/form-data" id="fileupload" commandName="fileupload" action="${pageContext.request.contextPath}/attachment/uploadfile-${whiteboard.id}.htm" target="uploadFrame">
        <span>File</span><input type="file" name="data"> <input type="hidden" name="id" id="uploadId" /><br/>
        <br/>
        <span>Description</span><textarea name="shortDescription" maxlength="170"></textarea>
        <br/>
        <div>
            <button type="button" class="cancel">Cancel</button>
            <input type="submit" value="Submit">
        </div> 
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

<div class="whiteboard draggable" data-context-path="${pageContext.request.contextPath}" data-user-mail="${user.email}" data-whiteboard-id="${whiteboard.id}">
    <c:forEach var="note" items="${notes}">
        <div class="note draggable" id="note-<c:out value="${note.id}"/>" style="left:<c:out value="${note.x}"/>px; top:<c:out value="${note.y}"/>px;">
            <div class="noteItems">
                <textarea name="text"><c:out value='${note.text}'/></textarea>
                <span class="creator"><c:out value='${note.creator.email}'/></span>
            </div>
            <div class="noteMenu">
                <a class="file_mouseOverMenu_top"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_top.png"></a>
                <a class="file_mouseOverMenu_middle"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_middle.png"></a>
                <a class="file_mouseOverMenu_bottom"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_bottom.png"></a>
            </div>
        </div>
    </c:forEach>
    <c:forEach var="attachment" items="${attachments}">
        <div class="attachment draggable" id="attachment-<c:out value="${attachment.id}"/>" style="left:<c:out value="${attachment.x}"/>px; top:<c:out value="${attachment.y}"/>px;">
            <div class="attachmentItems">
            	<p class="image"><img src="${pageContext.request.contextPath}/images/teambox-free-file-icons/32px/${attachment.fileExtension}.png"></p>
            	<p class="filename">
               		<c:out value="${fn:substring(attachment.filename,0, attachment.fileNameLenght)}"/>
            	</p>
            	<input type="hidden" name="filename" class="full_filename" value="${attachment.filename}">
            	<input type="hidden" name="creator" class="creator" value="${attachment.creator.email}">
            	<input type="hidden" name="description" class="description" value="${attachment.shortDescription}">
            </div>
            <div class="attachmentMenu">
                <a class="file_mouseOverMenu_top"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_top.png"></a>
                <a class="file_mouseOverMenu_middle"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_middle.png"></a>
                <a class="file_mouseOverMenu_bottom"><img src="${pageContext.request.contextPath}/images/file_mouseOverMenu_bottom.png"></a>
            </div>
        </div>
    </c:forEach>
</div>

<nav class="bottomNavigation">
    <ul>
        <li><div><a href="#" class="createNote"><img src="../images/new_note.png" alt="create_note" title="create new note" /><span>Note</span></a></div></li>
        <li><div><a href="#" class="uploadFile"><img src="../images/new_file.png" alt="uploadFile" title="Load File" /><span>File</span></a></div></li>
    </ul>
</nav> 

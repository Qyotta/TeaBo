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
<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery-ui-1.8.17.js"></script>
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
    <div class="wrapper"></div>
</div>

<div class="dialogs">
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
            <span>Enter an Email address</span>
        </h1>
        <form method="post" action="inviteuser-${whiteboard.id}.htm">
        Mail: <input type="text" class="mailaddress" name="address"/><br/>
        <div class="buttonline" >
            <input type="submit" value="Submit">
            <button type="button" class="cancel">Cancel</button>
        </div>
        </form>
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
</div>

<div id="startscreen">
    <div class="lightbox" data-type="tooltip">
        <h1>Hello and welcome to [lao]</h1>
        [lao] (look ahead online) is an online collaboration tool for the development of ideas, 
        brainstorming or just collecting information during a project. All this can be done interactive and 
        in real-time with colleagues or friends.<br/>
        <br/>
        You have a multitude of possibilities to present your information. For example place notes, upload files or 
        add pictures to the [lao]-whiteboard. The whiteboard is your interactive platform for working collaboratively with 
        a chosen group of colleagues or friends. <br>
        <br/>
        Take the interactive tour, where you will see all the important features and get a quick overview of the whiteboard.<br/>
        <br/>
        Enjoy using this tool!<br/>
        <br/>
        <input type="button" class="closeToolTip" value="Close window" />
        <input type="button" class="nextToolTip" value="Start tour" />
        
        <div class="showAgain">
            <input type="checkbox" name="showAgain" id="showAgain" value="1" checked="checked"/> Don't show this again!
        </div>
    </div>
    <div class="bubble" id="createNote" data-type="tooltip">
        <img src="${pageContext.request.contextPath}/images/tooltips/bottom.png" class="bottom" style="left:5px" />
        <button class="closeToolTip" />X</button>
        <h2>Create a note</h2>
        Create a note on the Whiteboard and add textual information. You can add some text, later edit it, move the note or delete it.<br/>
        <br/>
        Every note can be edited by everyone else, who is assigned to the whiteboard. The only exception is, while somebody is editing a note, 
        nobody else can edit it.<br/>
        <br/>
        <input type="button" class="prevToolTip" value="Back" />
        <input type="button" class="nextToolTip" value="Next" />
    </div>
    <div class="bubble" id="uploadFile" data-type="tooltip">
        <img src="${pageContext.request.contextPath}/images/tooltips/bottom.png" class="bottom" style="left:5px" />
        <button class="closeToolTip" />X</button>
        <h2>Upload a file</h2>
        Via clicking on this icon you can add files to the whiteboard. A small window will pop up, 
        where you can choose the file, which you would like to upload.<br/>
        <br/>
        The following file types are allowed: PDF, DOC, DOCx, XLS, PPT, PPTx, ODP, ODF.<br/>
        <br/>
        After the upload of the file, a small symbol will appear, which can be moved just like a note.<br/>
        <br/>
        <input type="button" class="prevToolTip" value="Back" />
        <input type="button" class="nextToolTip" value="Next" />
    </div>
    <div class="bubble" id="inviteUser" data-type="tooltip">
        <img src="${pageContext.request.contextPath}/images/tooltips/top.png" class="top" style="right:120px" />
        <button class="closeToolTip" />X</button>
        <h2>Invite a user to a whiteboard</h2>
        For working collaboratively with others, just invite a user. The only thing you need is the email address of the user.<br/>
        <br/>
        If the person is already registered, the user can see the whiteboard in his personal overview. Otherwise the system will 
        register and notify the user via email.<br/>
        <br/>
        <input type="button" class="prevToolTip" value="Back" />
        <input type="button" class="nextToolTip" value="Next" />
    </div>
    <div class="bubble" id="dragAndDrop" data-type="tooltip">
        <button class="closeToolTip" />X</button>
        <h2>Move Whiteboard and Notes</h2>
        You can move your notes and your whiteboard via drag and drop. This allows you to order your notes as you want. You're able
        to move the whiteboard and every note!<br/>
        <br/>
        <img src="${pageContext.request.contextPath}/images/tooltips/moveNotes.png" class="top" style="right:120px" />
        <br />
        To move the whiteboard, just click on it and move it to your desire position. For notes you'll find a handler to move each
        one.<br/>
        <br/>
        <input type="button" class="prevToolTip" value="Back" />
        <input type="button" class="nextToolTip" value="Next" />
    </div>
    <div class="lightbox" data-type="tooltip">
        <h1>End of the tour!</h1>
        Enjoy your whiteboard!<br/>
        <br/>
        <input type="button" class="closeToolTip" value="Close window" />
    </div>
</div>

<div id="whiteboard" class="whiteboard draggable" data-context-path="${pageContext.request.contextPath}" data-user-mail="${user.email}" data-whiteboard-id="${whiteboard.id}">
    <c:forEach var="note" items="${notes}">
        <div class="note draggable" id="note-<c:out value="${note.id}"/>" style="left:<c:out value="${note.x}"/>px; top:<c:out value="${note.y}"/>px; z-index:<c:out value="${note.orderIndex}"/>;">
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
        <div class="attachment draggable" id="attachment-<c:out value="${attachment.id}"/>" style="left:<c:out value="${attachment.x}"/>px; top:<c:out value="${attachment.y}"/>px; z-index:<c:out value="${attachment.orderIndex}"/>;">
            <div class="attachmentItems">
                <p class="image"><img src="${pageContext.request.contextPath}/images/teambox-free-file-icons/32px/${attachment.fileExtension}.png"></p>
                <p class="filename">
                    <c:out value="${fn:substring(attachment.filename,0, attachment.fileNameLength)}"/>
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
        <li><div><a href="#" class="createNote"><img src="../images/new_note.png" alt="create new note" title="create new note" /><span>Note</span></a></div></li>
        <li><div><a href="#" class="uploadFile"><img src="../images/new_file.png" alt="upload file" title="upload file" /><span>File</span></a></div></li>
    </ul>
    <ul>
        <li><div><a href="showToolTips"><img src="../images/showTooltips.png" alt="show tooltips" /><span>Tooltip</span></a></div></li>
    </ul>
</nav>

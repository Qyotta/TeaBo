<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>

<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]> <html class="no-js" lang="en">           <![endif]-->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>[lao] - Startseite</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
<script type="text/javascript">var config = {contextPath: '${pageContext.request.contextPath}'}</script>
<script src="${pageContext.request.contextPath}/resources/js/libs/require/require.js"></script>

<script type="text/javascript">
require.config({
    paths: {
        jquery: 'resources/js/libs/jquery/jquery-min',
        underscore: 'resources/js/libs/underscore/underscore-min',
        backbone: 'resources/js/libs/backbone/backbone-optamd3-min',
        text: 'resources/js/libs/require/text',
        templates: 'resources/templates',
        collections:'resources/js/collections',
        models:'resources/js/models',
        views:'resources/js/views',
        router:'resources/js/router'
    }
});

require([
    // Load our app module and pass it to our definition function
    'backbone',
    'resources/js/app',
    'models/user'
], function(Backbone,App,User){
    // The "app" dependency is passed in as "App"
   $(function() {
        <c:if test="${not empty user}">
            var userData = {id:${user.id},firstname:"${user.firstname}",lastname:"${user.lastname}",email:"${user.email}",position:"${user.position}",showToolTips:${user.showToolTips}}
        </c:if>
        var userData = userData || {};
        window.app = new App({
            debug: true, 
            user : new User(userData)
        });
        
        app.init();
        
        Backbone.history.start();
    });
});
</script>

<nav id="topNavigation">
    
</nav>

<div id="page">
	
</div>

<div id="dialogs">
    
</div>

<nav id="bottomNavigation"></nav>
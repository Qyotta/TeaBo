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
<script type="text/javascript">
<c:if test="${not empty user}">
    window.userData = {id:${user.id},firstname:"${user.firstname}",lastname:"${user.lastname}",email:"${user.email}",position:"${user.position}"};
</c:if>
</script>
<script data-main="resources/js/main"src="${pageContext.request.contextPath}/resources/js/libs/require/require.js"></script>



<nav id="topNavigation"></nav>
<nav class="rightNavigation"></nav>
<div id="page"></div>
<div id="dialogs"></div>
<nav id="bottomNavigation"></nav>
<div id="tooltips"></div>
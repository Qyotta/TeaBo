<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]> <html class="no-js" lang="en">           <![endif]-->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>[lao] - HTTP Error</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />

<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery-ui-1.8.17.js"></script>

<script src="${pageContext.request.contextPath}/js/application.js"></script>
<script src="${pageContext.request.contextPath}/js/utils.js"></script>
<script type="text/javascript">var config = { contextPath: '${pageContext.request.contextPath}' }</script>

<nav class="topNavigation">
    <h1 class="logo">
        <a href="${pageContext.request.contextPath}/user/login.htm">
            <b>lao (V 0.1a)</span>
        </a>
    </h1>
</nav>

<div id="error">
<p>Internal Error <c:out value="${exception}"/>.</p>
</div>

<nav class="bottomNavigation"></nav>
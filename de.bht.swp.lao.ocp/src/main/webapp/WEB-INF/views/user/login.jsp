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
<title>[lao] - User login</title>
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

<div class="loginContainer">
    <h1>
        Welcome to [lao]
        <span>Please Login</span>
    </h1>
    <form:form name="loginFormData" modelAttribute="loginFormData" method="POST" commandName="loginFormData" action="login.htm">
        <dl>
            <dt>Email:</dt>
            <dd>
                <c:set var="emailInputErrors">
                    <form:errors path="email" element="div" />
                    
                </c:set>
                <c:choose>
                    <c:when test="${not empty emailInputErrors}">
                        <form:input path="email" cssClass="wrongfield" />
                        <div class="exclamation">
                            <img src="../images/exclamation_mark.png">
                            <div class="errors">${emailInputErrors}</div>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <form:input path="email" />
                    </c:otherwise>
                </c:choose>

            </dd>
            <dt>Password:</dt>
            <dd>
                <c:set var="passwordEmailInputErrors">
                    <form:errors path="password" element="div" />
                    
                </c:set>
                <c:choose>
                    <c:when test="${not empty passwordEmailInputErrors}">
                        <form:password path="password" cssClass="wrongfield" />
                        <div class="exclamation">
                            <img src="../images/exclamation_mark.png">
                            <div class="errors">${passwordEmailInputErrors}</div>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <form:password path="password" />
                    </c:otherwise>
                </c:choose>
                
            </dd>
            <dt>
                <br /> <a
                    href="${pageContext.request.contextPath}/user/register.htm">Create
                    Account</a>
            </dt>
            <dd>
                <br /> <input type="submit" value="Login" class="button">
            </dd>
        </dl>

    </form:form>
</div>

<nav class="bottomNavigation"></nav>
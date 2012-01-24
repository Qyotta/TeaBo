<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]> <html class="no-js" lang="en">           <![endif]-->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>User register</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />

<script src="${pageContext.request.contextPath}/js/application.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/jquery/jquery-1.6.2.js"></script>
<script src="${pageContext.request.contextPath}/js/libs/modernizr-2.0.6.min.js"></script>
<script src="${pageContext.request.contextPath}/js/errordisplay.js"></script>
<script type="text/javascript">var config = {contextPath: '${pageContext.request.contextPath}'}</script>

<nav class="topNavigation">
    <h1 class="logo">
        <a href="${pageContext.request.contextPath}/user/login.htm">
            <b>lao (V 0.1a)</span>
        </a>
    </h1>
</nav>


<div class="registerContainer">

    <h1>
        Registration
        <span>Fields with * are required.</span>
    </h1>

    <form:form name="registerFormData" method="POST" commandName="registerFormData" action="register.htm">
    <dl>
        <dt>E-Mail Address*</dt>
        <dd>
            <c:set var="emailErrors">
                <form:errors path="email" element="div" />
            </c:set>
            <c:choose>
                <c:when test="${not empty emailErrors}">
                <form:input path="email"  cssClass="wrongfield"/>
                    <div class="exclamation">
                        <img src="../images/exclamation_mark.png">
                        <div class="errors">${emailErrors}</div>
                    </div>
                </c:when>
                <c:otherwise>
                    <form:input path="email" />
                </c:otherwise>
            </c:choose>
        </dd>
        <dt>Choose Password*</dt>
        <dd>
            <c:set var="passwordErrors">
                <form:errors path="password" element="div" />
            </c:set>
            <c:choose>
                <c:when test="${not empty passwordErrors}">
                    <form:password path="password" cssClass="wrongfield"/>
                    <div class="exclamation">
                        <img src="../images/exclamation_mark.png">
                        <div class="errors">${passwordErrors}</div>
                    </div>
                </c:when>
                <c:otherwise>
                    <form:password path="password"/>
                </c:otherwise>
            </c:choose>
        </dd>
        <dt>Confirm Password*</dt>
        <dd>
            <c:set var="passwordValidateErrors">
                <form:errors path="passwordvalidate" element="div" />
            </c:set>
            <c:choose>
                <c:when test="${not empty passwordValidateErrors}">
                    <form:password path="passwordvalidate"  cssClass="wrongfield"/>
                    <div class="exclamation">
                        <img src="../images/exclamation_mark.png">
                        <div class="errors">${passwordValidateErrors}</div>
                    </div>
                </c:when>
                <c:otherwise>
                    <form:password path="passwordvalidate" />
                </c:otherwise>
            </c:choose>
        </dd>
        <dt>First Name<form:errors path="firstname" cssClass="registerError" /></dt>
        <dd><form:input path="firstname" /></dd>
        <dt>Last Name<form:errors path="lastname" cssClass="registerError" /></dt>
        <dd><form:input path="lastname" /></dd>
        <dt>Position <span>(e.g. Project Manager)</span><form:errors path="position" cssClass="registerError" /></dt>
        <dd><form:input path="position" /></dd>
    </dl>

    <div class="registerCancelButtons">
        <input type="submit" value="Register Now" class="submitButton">
        <a href="${pageContext.request.contextPath}/user/login.htm">
            <input type="button" value="Cancel" class="submitButton">
        </a>
    </div>
</div>

</form:form>
<nav class="bottomNavigation"></nav>
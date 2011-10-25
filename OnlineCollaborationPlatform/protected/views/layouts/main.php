<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
    
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/style.css" />
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/libs/modernizr-2.0.6.min.js"></script>
</head>

<body>

    <?php echo $content; ?>

    <nav class="rightNavigation">
        <ul>
            <li><a href="#login"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/user.png" alt="Login" title="Login" /></a></li>
            <li><a href="#info"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/info.png" alt="Info" title="Info" /></a></li>
            <li><a href="#settings"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/wrench.png" alt="Settings" title="Settings" /></a></li>
        </ul>
       
        <div>
            <div class="login">
                <form id="login-form" action="index.php" method="post">
                <input type="text" name="LoginForm[username]" placeholder="your username" /><?php //echo $form->textField($model,'username'); ?>
                <input type="password" name="LoginForm[password]" placeholder="your password" /><?php //echo $form->passwordField($model,'password'); ?>
                <input type="submit" name="yt0" value="Login" class="submit" /><?php //echo CHtml::submitButton('Login'); ?>
                </form>
            </div>
            <div class="info">
                some info text
            </div>
            <div class="settings">
                some settings here
            </div>
        </div>
    </nav>

    <nav class="bottomNavigation">
        <ul>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/pin_map.png" alt="Get URL" title="Get URL" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/zoom.png" alt="Search" title="Search" /></a></li>
        </ul>
        <ul class="right">
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/calendar.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/chart_line.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/checkbox_checked.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/doc_empty.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/music.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/notepad.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/pencil.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/picture.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/preso.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/spechbubble_sq_line.png" alt="Search" title="Search" /></a></li>
            <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/tag.png" alt="Search" title="Search" /></a></li>
        </ul>
    </nav>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/libs/jquery-1.6.2.min.js"><\/script>')</script>
    <script defer src="js/plugins.js"></script>
    <script defer src="js/script.js"></script>
    <script>
      // window._gaq = [['_setAccount','UAXXXXXXXX1'],['_trackPageview'],['_trackPageLoadTime']];
      // Modernizr.load({
        // load: ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js'
      // });
    </script>

    <!--[if lt IE 7 ]>
      <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
      <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
    <![endif]-->
  
</body>
</html>

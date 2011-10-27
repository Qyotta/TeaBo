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
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/libs/jquery-1.6.2.min.js"><\/script>')</script>
    <script defer src="<?php echo Yii::app()->request->baseUrl; ?>/js/plugins.js"></script>
    <script defer src="<?php echo Yii::app()->request->baseUrl; ?>/js/script.js"></script>
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
</head>

<body>

    <?php echo $content; ?>

    <?php $this->renderPartial('//modules/rightNavigation'); ?>

    <?php $this->renderPartial('//modules/bottomNavigation'); ?>
  
</body>
</html>

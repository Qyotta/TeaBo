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
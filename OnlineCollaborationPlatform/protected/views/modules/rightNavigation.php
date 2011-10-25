<nav class="rightNavigation">
	<ul>
		<li>
			<a href="#login"><img src="<?php echo Yii::app() -> request -> baseUrl;?>/images/icons/user.png" alt="Login" title="Login" /></a>
		</li>
		<li>
			<a href="#info"><img src="<?php echo Yii::app() -> request -> baseUrl;?>/images/icons/info.png" alt="Info" title="Info" /></a>
		</li>
		<li>
			<a href="#settings"><img src="<?php echo Yii::app() -> request -> baseUrl;?>/images/icons/wrench.png" alt="Settings" title="Settings" /></a>
		</li>
	</ul>
	<div>
		<div class="login">
			<?php
			if (Yii::app() -> user -> isGuest) {
				$this -> widget('UserLoginWidget');
			} else {
				$this -> widget('UserInfoWidget');
			}
			?>
		</div>
		<div class="info">
			some info text
		</div>
		<div class="settings">
			some settings here
		</div>
	</div>
</nav>
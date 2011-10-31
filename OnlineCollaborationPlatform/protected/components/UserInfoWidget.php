<?php
class UserInfoWidget extends CWidget {
	public function run() {
		$this -> renderContent();
	}

	protected function renderContent() {
	    $model = User::model()->findByPK(Yii::app()->user->id);
		$this->render('user-info',array('model'=>$model));
	}
}

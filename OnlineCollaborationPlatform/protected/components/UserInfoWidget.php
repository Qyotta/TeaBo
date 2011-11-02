<?php
class UserInfoWidget extends CWidget {
	public function run() {
		$this -> renderContent();
	}

	protected function renderContent() {
	    $createWhiteboardModel = new CreateWhiteboardForm;
	    $user = User::model()->findByPK(Yii::app()->user->id); 
		
        // collect user input data
        if(isset($_POST['CreateWhiteboardForm']))
        {
            $createWhiteboardModel->attributes = $_POST['CreateWhiteboardForm'];
            // validate user input, create whiteboard and redirect to the previous page if valid
            if($createWhiteboardModel->validate() && $createWhiteboardModel->createWhiteboard())
                Yii::app()->controller->redirect(array('site/index'));
        }
        $invitedToWhiteboards = Whiteboard::model()->getWhiteboardsByUserId(Yii::app()->user->id);
		$this->render('user-info',
						array('user'=>$user,
							  'createWhiteboardModel'=>$createWhiteboardModel,
							  'invitedToWhiteboards'=>$invitedToWhiteboards));
	}
}

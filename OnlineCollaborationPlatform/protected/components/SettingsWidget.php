<?php

class SettingsWidget extends CWidget {
    public function run() {
        $this->renderContent();
    }

    protected function renderContent() {
        $model = new InviteUserForm;
        $model->whiteboardId = $_GET['id'];
        $whiteboard = Whiteboard::model()->findByPK($_GET['id']);
        
        // collect user input data
        if(isset($_POST['InviteUserForm']))
        {
            $model->attributes = $_POST['InviteUserForm'];
            // validate user input, invite him and redirect to the previous page if valid
            if($model->validate()) {
                $model->inviteUser();
            }
        }
        
        // display widget
        $this->render('settings',array('model'=>$model,'whiteboard'=>$whiteboard));
    }
}
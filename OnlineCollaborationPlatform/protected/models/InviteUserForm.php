<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class InviteUserForm extends CFormModel
{
    public $user;
    public $whiteboardId;

    /**
     * Declares the validation rules.
     * The rules state that email and password are required,
     * and password needs to be authenticated.
     */
    public function rules()
    {
        return array(
            // username and password are required
            array('user', 'required'),
            // rememberMe needs to be a boolean
            array('user', 'email'),
        );
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels()
    {
        return array(
            'user'=>'Email Address',
        );
    }
    
    /*
     * 
     */
    public function inviteUser() {
        $whiteboard = Whiteboard::model()->findByPK($this->whiteboardId);
        $whiteboard-> inviteUser($this->user);
        return true;
    }

    
}

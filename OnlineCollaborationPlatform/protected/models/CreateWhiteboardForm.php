<?php

/**
 * Create Whiteboard Form model class
 * contains logic to keep form information
 * creates whiteboards
 */
class CreateWhiteboardForm extends CFormModel
{
    public $name;

    /**
     * Declares the validation rules.
     * name is required
     */
    public function rules()
    {
        return array(
            // username and password are required
            array('name', 'required'),
        );
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels()
    {
        return array(
            'name'=>'whiteboard name',
        );
    }
    
    /*
     * stores whiteboard in the DB
     */
    public function createWhiteboard() {
        var_dump("sdasdsadsa");
        if (Yii::app() -> user -> isGuest){
            throw new CHttpException(403,'You are not allowed to create a whiteboard. Please login to use this feature.');
        }else{
            $whiteboard = new Whiteboard;
            $whiteboard->name=$this->name;
            $whiteboard->ownerId=Yii::app()->user->id;
            $whiteboard->date = new CDbExpression('NOW()');
            if($whiteboard->validate())
            {
                $whiteboard->save();
                return true;
            }
        }
        return false;
    }
}

<?php 
/*
 * form to login
 */
$form=$this->beginWidget('CActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); 

echo $form->textField($model,'email',array('placeholder'=>'e-mail adress')).
     $form->passwordField($model,'password',array('placeholder'=>'password')).
     CHtml::submitButton('Login');

$this->endWidget();
?>
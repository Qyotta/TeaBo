<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>

	<?php echo $form->textField($model,'email'); ?>
	<?php echo $form->passwordField($model,'password'); ?>
	<?php echo CHtml::submitButton('Login'); ?>
	

<?php $this->endWidget(); ?>
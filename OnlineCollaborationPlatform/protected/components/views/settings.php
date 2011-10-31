<?php
$whiteboard = Whiteboard::model()->findByPK($model->whiteboardId);
?>

<div class="settings">
    <h2>User, having access to this whiteboard:</h2>
    <?php
    if(count($whiteboard->whiteboardusers)) echo "<ul>";
    foreach($whiteboard->whiteboardusers as $user) {
        echo "<li>{$user->email}</li>";
    }
    if(count($whiteboard->whiteboardusers)) echo "</ul>";
    else echo "No user invited!";
    ?>        
    
    <h2>Invite User</h2>
    <?php $form=$this->beginWidget('CActiveForm', array(
        'id'=>'InviteUserForm',
        'enableClientValidation'=>true,
        'clientOptions'=>array(
            'validateOnSubmit'=>true,
        ),
    )); ?>
    
    <input type="hidden" name="id" value="<?php echo $whiteboard->id ?>" />
    <?php echo $form->textField($model,'user'); ?>
    <?php echo CHtml::submitButton('Invite'); ?>
        
    
    <?php $this->endWidget(); ?>

</div>
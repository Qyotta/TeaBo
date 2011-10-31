
<div class="settings">
    <h2>User, having access to this whiteboard:</h2>
    <?php
    /*
     * show list of users, accessing to current whiteboard
     */
    if(count($whiteboard->whiteboardusers)) {
        echo "<ul>";
        foreach($whiteboard->whiteboardusers as $user) echo "<li>{$user->email}</li>";
        echo "</ul>";
    } else {
        echo "<span>No user invited!</span>";
    }
    ?>        
    
    <h2>Invite User</h2>
    <?php 
    /*
     * display form to invite new users to the whiteboard
     */
    $form=$this->beginWidget('CActiveForm', array(
        'id'=>'InviteUserForm',
        'enableClientValidation'=>true,
        'clientOptions'=>array(
            'validateOnSubmit'=>true,
        ),
    ));
    echo "
         <input type=\"hidden\" name=\"id\" value=\"".$whiteboard->id."\" />
         ".$form->textField($model,'user')."
         ".CHtml::submitButton('Invite')."
    ";
    
    $this->endWidget();
    ?>
</div>
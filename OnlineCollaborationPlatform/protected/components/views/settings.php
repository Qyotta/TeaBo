
<div class="settings">
    <h2>User, having access to this whiteboard:</h2>
    <?php
    /*
     * show list of users, accessing to current whiteboard
     */
    echo "<ul>";
    echo "<li><b>{$whiteboard->owner->email}</b></li>";
    if(count($whiteboard->whiteboardusers)) {
        
        foreach($whiteboard->whiteboardusers as $user) echo "<li>{$user->email}</li>";
        
    }
	echo "</ul>";
    ?>        
    <?php
    	if($whiteboard->isOwner())
		{
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
		} // isOwner - close
    ?>
</div>
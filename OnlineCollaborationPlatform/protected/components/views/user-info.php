<h2>Hallo <span data-userId="<?=$user->getUserId()?>"><?=$user->getUsername()?></span></h2> <?=CHtml::link('[Logout]',array('site/logout'),array('class'=>'logout'))?>

<?php
/*
 * show list of all whiteboards, the user ownes
 */
$whiteboards = $user->whiteboards;
if(isset($whiteboards) && count($whiteboards)){
    echo "<ul>";
    foreach($whiteboards as $w){
        $linkToWhiteboard = CHtml::link($w->name,array('whiteboard/view','id'=>$w->id));
        $linkToDelete = CHtml::link('[x]',array('whiteboard/delete','id'=>$w->id));
        echo '<li>'.$linkToWhiteboard.$linkToDelete.'</li>';
    }
    echo "</ul>";
}else{
    echo '<span>No whiteboard exist.</span>';
}
?>

<?php

/*
 * show a list of whiteboards the user is invited to.
 */
if(isset($invitedToWhiteboards) && count($invitedToWhiteboards)>0){
	echo "<h2>open assigned whiteboard</h2>";
    echo "<ul>";
	
    foreach($invitedToWhiteboards as $whiteboard){
        $linkToWhiteboard = CHtml::link($whiteboard->name,array('whiteboard/view','id'=>$whiteboard->id));
        echo '<li>'.$linkToWhiteboard.'</li>';
    }
    echo "</ul>";
}
?>

<?php 
/*
 * form to create a new whiteboard
 */
echo '<h2>new whiteboard</h2>';

$form=$this->beginWidget('CActiveForm', array(
    'id'=>'CreateWhiteboardForm',
    'enableClientValidation'=>false,));
 
echo $form->textField($createWhiteboardModel,'name').
     CHtml::submitButton('Create');


$this->endWidget();
?>

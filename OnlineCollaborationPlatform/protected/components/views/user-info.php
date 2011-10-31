<h2>Hallo <span><?=$model->getUsername()?></span></h2> <?=CHtml::link('[Logout]',array('site/logout'),array('class'=>'logout'))?>

<?php
/*
 * show list of all whiteboards, the user ownes
 */
$whiteboards = User::model()->findByPK(Yii::app()->user->id)->whiteboards;       
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

<h2>open new whiteboard</h2>
<?php 
/*
 * form to create a new whiteboard
 */
$form=$this->beginWidget('CActiveForm', array(
    'id'=>'CreateWhiteboardForm',
    'enableClientValidation'=>false,
)); 
echo $form->textField($createWhiteboardModel,'name').
     CHtml::submitButton('Create');

$this->endWidget();
?>

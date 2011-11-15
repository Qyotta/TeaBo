<div class="postIt" id="postIt-<?php echo $postit->id; ?>" style="position:absolute; left:<?= $postit->xposition?>px; top:<?= $postit->yposition?>px; z-index=<?= $postit->id?>"> 

<?php $form = $this->beginWidget('CActiveForm', array(
    'id'=>'user-form',
    'enableAjaxValidation'=>true,
    'action'=>array('postIt/update','id'=>$postit->id),
    'focus'=>array($postit,'headline'),
)); 
echo $form->textField($postit, 'headline');
echo $form->textArea($postit, 'text');

$this->endWidget();
?>

    
</div>
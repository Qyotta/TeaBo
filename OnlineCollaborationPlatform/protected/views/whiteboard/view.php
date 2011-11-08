<?php $this->pageTitle=Yii::app()->name.' | Whiteboard('.$whiteboard->name.')'; ?>

<?php
    $postits = PostIt::model()->findAllByAttributes(array('whiteboardId'=> $whiteboard->id));
    foreach ($postits as $postit) {
?>

<div class="postIt"> 
    
    <p> <?php echo $postit->text;?></p>
    
</div>
<?php
}
?>
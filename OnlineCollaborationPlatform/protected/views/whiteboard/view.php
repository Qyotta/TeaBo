<?php $this->pageTitle=Yii::app()->name.' | Whiteboard('.$whiteboard->name.')'; ?>

<?php
	// loads all postits for current whiteboard
    $postits = PostIt::model()->findAllByAttributes(array('whiteboardId'=> $whiteboard->id));
    foreach ($postits as $postit) {
    	// shows a postit (/views/postIt/view.php)
		$this->renderPartial('//postIt/view',array('postit'=>$postit));	
	}
	
?>

<script type="text/javascript">
pulled = false;
$(document).ready(function() {
	
	if(pulled != true){
	pulled = true;
	pollData('<?php echo Yii::app()->urlManager->createUrl('postIt/getData', array('whiteboardId' => $whiteboard->id));?>');
	}
});
</script>

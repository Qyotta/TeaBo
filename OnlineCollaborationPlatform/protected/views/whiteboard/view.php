<?php $this->pageTitle=Yii::app()->name.' | Whiteboard('.$whiteboard->name.')'; ?>

<?php
    $postits = PostIt::model()->findAllByAttributes(array('whiteboardId'=> $whiteboard->id));
    foreach ($postits as $postit) {
		$this->renderPartial('//postIt/view',array('postit'=>$postit));	
	}
?>
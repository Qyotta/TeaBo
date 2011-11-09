<?php

class PostItController extends Controller
{
	public function actionCreate($whiteboardId)
	{
		$model = new PostIt;
		$model->text = $_POST['PostIt']['text'];
		$model->whiteboardId = $whiteboardId;
        $model->xposition = $_POST['PostIt']['x'];
        $model->yposition = $_POST['PostIt']['y'];
        $model->save();
	}
	
	public function actionUpdate($id){
		$postit = PostIt::model()->findByPk($id);
		var_dump($postit);
		if($postit){
			if(isset($_POST['PostIt']['text'])) $postit->text = $_POST['PostIt']['text'];
            $postit->xposition = $_POST['PostIt']['x'];
            $postit->yposition = $_POST['PostIt']['y'];
			if($postit->validate() && $postit->save()){
				Yii::app()->end();
			}
		}
	}	

	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
}
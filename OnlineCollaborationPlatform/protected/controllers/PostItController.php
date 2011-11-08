<?php

class PostItController extends Controller
{
	public function actionCreate($whiteboardId)
	{
		$model = new PostIt;
		$model->text = "Dummy PostIt ich bin ein PostIt und du nicht!";
		$model->whiteboardId = $whiteboardId;
		$model->xposition = rand(0,800);
		$model->yposition = rand(0,500);
		$model->save();
		
		$this->redirect(array('whiteboard/view','id'=>$whiteboardId));
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
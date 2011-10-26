<?php

class WhiteboardController extends Controller
{
	public function actionIndex()
	{
		$whiteboards = Whiteboard::model()->findAllByAttributes(array('owner'=>Yii::app()->user->id));
		$this->render('//whiteboard/index',array('whiteboards'=>$whiteboards));

	}
	
	public function actionCreate()
	{
		$whiteboard = new Whiteboard;
		$whiteboard->name='Whiteboard01'; 
		$whiteboard->date=date(DATE_RFC822); 
		$whiteboard->owner=Yii::app()->user->id;
		$whiteboard->save(); 
		$this->render('//whiteboard/index',array("model"=>$whiteboard));
		
	}
	public function actionView($id){
		$whiteboard = Whiteboard::model()->findByPK($id);
		$this->render('//whiteboard/view',array("model"=>$whiteboard));
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
<?php

class PostItController extends Controller {

	public function actionCreate($whiteboardId) {
		$model = new PostIt;
		$model -> headline = $_POST['PostIt']['headline'];
		$model -> text = $_POST['PostIt']['text'];
		$model -> whiteboardId = $whiteboardId;
		$model -> xposition = $_POST['PostIt']['x'];
		$model -> yposition = $_POST['PostIt']['y'];
		$model -> ownerId = Yii::app() -> user -> id;
		$model -> save();
		echo Yii::app() -> controller -> createUrl('postIt/update', array('id' => $model -> id));
		Yii::app() -> end();
	}

	public function actionUpdate($id) {
		$postit = PostIt::model() -> findByPk($id);
		if ($postit) {
			$postit -> modified = new CDbExpression('NOW()');

			// isset is similar != null!
			// if PostIt status is != null - then...
			// Either set the Status
			if (isset($_POST['PostIt']['status'])) {
				if ($_POST['PostIt']['status'] == 'lock') {
					//When status = lock - then locked = 1
					$postit -> isLocked = 1;

				} elseif ($_POST['PostIt']['status'] == 'unlock') {
					//When status = unlock - then locked = 0
					$postit -> isLocked = 0;
				}

			} else {
				// or set the Position
				$postit -> xposition = $_POST['PostIt']['x'];
				$postit -> yposition = $_POST['PostIt']['y'];
			}

			if (isset($_POST['PostIt']['headline']))
				$postit -> headline = $_POST['PostIt']['headline'];

			// Set only Text when Text is given
			if (isset($_POST['PostIt']['text']))
				$postit -> text = $_POST['PostIt']['text'];

			//Database update!
			if ($postit -> validate() && $postit -> save()) {
				Yii::app() -> end();
			}

		}
	}

	public function actionGetData($whiteboardId) {
		set_time_limit(20);
		// force connection only after 5 minutes
		ignore_user_abort(false);
		// if the connection ends, terminate immediately

		//TODO: sleep is not very recommended, workaround for multiple pulls without change!
		sleep(1);

		//Find all PostIts by Whiteboard Id
		$date = new CDbExpression('NOW()');
		$criteria = new CDbCriteria;
		$criteria -> addCondition("modified >= $date");
		$criteria -> addCondition("whiteboardId = $whiteboardId");
		$postIts = PostIt::model() -> findAll($criteria);
		while (count($postIts) == 0) {

			$postIts = PostIt::model() -> findAll($criteria);
			
		}
		if(count($postIts) > 0){		
			$array = array();
			foreach($postIts as $postIt){
				$array[] = $postIt->toArray();
			}
			echo json_encode($array);
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

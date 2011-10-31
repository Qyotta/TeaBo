<?php

class WhiteboardController extends Controller
{
	public function actionList()
	{
		if (Yii::app() -> user -> isGuest){
			throw new CHttpException(403,'You are not allowed to list whiteboards. Please login to use this feature.');
		}else{
			// Alle Whiteboards, die dem eingeloggten User gehören, aus der Datenbank holen.
			$whiteboards = User::model()->findByPK(Yii::app()->user->id)->whiteboards;
			$this->render('//whiteboard/list',array('whiteboards'=>$whiteboards));
		}
	}
	
	
	public function actionCreate()
	{
		if (Yii::app() -> user -> isGuest){
			throw new CHttpException(403,'You are not allowed to create a whiteboard. Please login to use this feature.');
		}else{
			$whiteboard = new Whiteboard;
			if(isset($_POST['Whiteboard']))
    		{

				$whiteboard->attributes=$_POST['Whiteboard'];
				$whiteboard->ownerId=Yii::app()->user->id;
				$whiteboard->date = new CDbExpression('NOW()');
			    if($whiteboard->validate())
			    {
			        $whiteboard->save(); 
					$this->redirect(array('whiteboard/view','id'=>$whiteboard->id));
					    // form inputs are valid, do something here
			        return;
			    }
				
				/*
				$whiteboard->name='Whiteboard01'; 
				$whiteboard->date=date(DATE_RFC822); 
				$whiteboard->ownerId=Yii::app()->user->id;
				*/
				// Erzeugtes Whiteboard in der Datenbank ablegen.
				//$whiteboard->save(); 
				
				// Weiterleiten um das Whiteboard nach dem Erstellen anzuzeigen.
				// $this->redirect(array('whiteboard/view','id'=>$whiteboard->id));
				// $this->render('//whiteboard/view',array("model"=>$whiteboard));
			}
			else 
			{
				$this->render('create',array('model'=>$whiteboard));
			}
		}
	}
	public function actionView($id){
		// Whiteboard mit 'Primary Key' aus der Datenbank lesen
		$whiteboard = Whiteboard::model()->findByPK($id);
		if(!$whiteboard){
			throw new CHttpException(404,'The specified whiteboard cannot be found.');
		}else{
			$this->render('//whiteboard/view',array('whiteboard'=>$whiteboard));
		}
	}

	public function actionDelete($id){
		// Nur User dürfen Whiteboards löschen
		if (Yii::app() -> user -> isGuest){
			throw new CHttpException(403,'You are not allowed to delete a whiteboard. Please login to use this feature.');
		}
		else{
			// Whiteboard aus der Datenbank lesen
			$whiteboard = Whiteboard::model()->findByPK($id);
			
			if($whiteboard){
				if($whiteboard->ownerId == Yii::app()->user->id){
					$whiteboard->delete();
					$this->redirect(array('whiteboard/list'));
				}
				else{
					throw new CHttpException(403,'You are not the owner. You are not allowed to delete this whiteboard.');
				}
			}
			else{
				throw new CHttpException(404,'The specified whiteboard cannot be found.');
			}
		}
	}
	
	public function actionInviteUser($id){
		$whiteboard = Whiteboard::model()->findByPK($id);
		$whiteboard-> inviteUser('andreas@sattler-berlin.de'); //dummy!!
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
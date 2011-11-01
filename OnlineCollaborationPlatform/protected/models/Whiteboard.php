<?php

/**
 * This is the model class for table "tbl_whiteboard".
 *
 * The followings are the available columns in table 'tbl_whiteboard':
 * @property integer $id
 * @property string $name
 * @property string $date
 * @property integer $ownerId
 *
 * The followings are the available model relations:
 * @property Postit[] $postits
 * @property User $owner
 * @property Whiteboardusers[] $whiteboardusers
 */
class Whiteboard extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @return Whiteboard the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'tbl_whiteboard';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, date, ownerId', 'required'),
			array('ownerId', 'numerical', 'integerOnly'=>true),
			array('name', 'length', 'max'=>255),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, name, date, ownerId', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'postits' => array(self::HAS_MANY, 'Postit', 'whiteboardId'),
			'owner' => array(self::BELONGS_TO, 'User', 'ownerId'),
			'whiteboardusers' => array(self::MANY_MANY, 'User', 'tbl_whiteboardUsers(whiteboardId, userId)'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'name' => 'Name',
			'date' => 'Date',
			'ownerId' => 'Owner',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('date',$this->date,true);
		$criteria->compare('ownerId',$this->ownerId);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
	/**
	 * creates relation between user and whiteboard, identified by email
	 * if email is not in the system a new user is generated
	 * @TODO find better solution for saving relation, see: http://code.google.com/p/giix/source/browse/trunk/giix/components/GxActiveRecord.php || http://www.yiiframework.com/extension/esaverelatedbehavior/
	 */
	public function inviteUser($email)
	{

		$user = User::model()->findByAttributes(array('email'=>$email));
		if($user===null){
			$user = new User;
			$user->email = $email;
			$newpw = $user->generatePassword();
			$user->password = sha1($newpw);
			$user->isRegistered = 0;
			$user->save();
			$currentUser = User::model()->findByPK(Yii::app()->user->id);
			
			$message = 'Hello, <br />
			'.$currentUser->firstname.' '.$currentUser->lastname.' has invited you to his Whiteboard "'.$this->name.'".<br />
			<br />
			You may login at http://'.Yii::app()->request->getServerName().Yii::app()->getRequest()->getBaseUrl().'.<br /><br />
			
			User: '.$email.'<br />
			Password: '.$newpw.'<br />
			<br />
			With Regards,<br /><br />
			
			[l]ook [a]head [o]nline
			';
			
			
			$mailer = new LAOMailer();
			
			$mailer->setSubject("[lao] Invitation to Whiteboard");
			$mailer->setMessage($message);
			$mailer->addAddress($email);
			$mailer->send();


		}
		

			
		$connection=Yii::app()->db;
		$command=$connection->createCommand("INSERT INTO `tbl_whiteboardUsers` (whiteboardId, userId) VALUES($this->id, $user->id)");
		$command->execute();

/*
		$whiteboardUsers = $this->whiteboardusers;
		$whiteboardUsers[] = $user->id;
		$whiteboardUsers->save();
		CVarDumper::dump($whiteboardUsers);
*/
 

	}
}
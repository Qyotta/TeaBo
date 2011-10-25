<?php

/**
 * This is the model class for table "tbl_user".
 *
 * The followings are the available columns in table 'tbl_user':
 * @property integer $id
 * @property string $lastname
 * @property string $firstname
 * @property string $password
 * @property string $email
 * @property integer $isRegistered
 * @property string $lastVisit
 * @property string $created
 *
 * The followings are the available model relations:
 * @property Whiteboard $whiteboard
 * @property Whiteboardusers $whiteboardusers
 */
class User extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @return User the static model class
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
		return 'tbl_user';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('lastname, firstname, password, email, isRegistered, lastVisit, created', 'required'),
			array('isRegistered', 'numerical', 'integerOnly'=>true),
			array('lastname, firstname, email', 'length', 'max'=>255),
			array('password', 'length', 'max'=>48),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, lastname, firstname, password, email, isRegistered, lastVisit, created', 'safe', 'on'=>'search'),
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
			'whiteboard' => array(self::HAS_ONE, 'Whiteboard', 'id'),
			'whiteboardusers' => array(self::HAS_ONE, 'Whiteboardusers', 'id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'lastname' => 'Lastname',
			'firstname' => 'Firstname',
			'password' => 'Password',
			'email' => 'Email',
			'isRegistered' => 'Is Registered',
			'lastVisit' => 'Last Visit',
			'created' => 'Created',
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
		$criteria->compare('lastname',$this->lastname,true);
		$criteria->compare('firstname',$this->firstname,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('isRegistered',$this->isRegistered);
		$criteria->compare('lastVisit',$this->lastVisit,true);
		$criteria->compare('created',$this->created,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}
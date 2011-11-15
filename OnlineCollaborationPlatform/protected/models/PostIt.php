<?php

/**
 * This is the model class for table "tbl_postIt".
 *
 * The followings are the available columns in table 'tbl_postIt':
 * @property integer $id
 * @property string $headline
 * @property string $text
 * @property integer $xposition
 * @property integer $yposition
 * @property integer $whiteboardId
 * @property integer $ownerId
 * @property integer $currentEditor
 * @property integer $isLocked
 * @property string $modified
 *
 * The followings are the available model relations:
 * @property Whiteboard $whiteboard
 * @property User $owner
 * @property User $currentEditor0
 */
class PostIt extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @return PostIt the static model class
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
		return 'tbl_postIt';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('xposition, yposition, whiteboardId', 'required'),
			array('xposition, yposition, whiteboardId, ownerId, isLocked', 'numerical', 'integerOnly'=>true),
			array('headline', 'length', 'max'=>255),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, headline, text, xposition, yposition, whiteboardId, ownerId, isLocked, modified', 'safe', 'on'=>'search'),
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
			'whiteboard' => array(self::BELONGS_TO, 'Whiteboard', 'whiteboardId'),
			'owner' => array(self::BELONGS_TO, 'User', 'ownerId'),
			'currentEditor0' => array(self::BELONGS_TO, 'User', 'currentEditor'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'headline' => 'Headline',
			'text' => 'Text',
			'xposition' => 'Xposition',
			'yposition' => 'Yposition',
			'whiteboardId' => 'Whiteboard',
			'ownerId' => 'Owner',
			'currentEditor' => 'Current Editor',
			'isLocked' => 'Is Locked',
			'modified' => 'Modified',
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
		$criteria->compare('headline',$this->headline,true);
		$criteria->compare('text',$this->text,true);
		$criteria->compare('xposition',$this->xposition);
		$criteria->compare('yposition',$this->yposition);
		$criteria->compare('whiteboardId',$this->whiteboardId);
		$criteria->compare('ownerId',$this->ownerId);
		$criteria->compare('currentEditor',$this->currentEditor);
		$criteria->compare('isLocked',$this->isLocked);
		$criteria->compare('modified',$this->modified,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	public function toArray(){
		$array = array(
			'id' => $this->id,
			'headline' => $this->headline,
			'text' => $this->text,
			'x' => $this->xposition,
			'y' => $this->yposition,
			'isLocked' => $this->isLocked,
			'action' => Yii::app()->controller->createUrl('postIt/update', array('id' => $this->id)),
			'ownerId' => $this->ownerId,
		);
		return $array;
	}
}
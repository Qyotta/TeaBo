<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
	private $_id;
	
	/**
	 * Authenticates a user.
	 * 
	 * @return boolean whether authentication succeeds.
	 */
	public function authenticate()
	{
		$user = User::model()->findByAttributes(array('email'=>$this->username));
		if($user===null){
			$this->errorCode = self::ERROR_USERNAME_INVALID;
		}
		else if($user->password!= sha1($this->password))
		{
			$this->errorCode = self::ERROR_PASSWORD_INVALID;
		}else{
			$this->_id = $user->id;
			$this->errorCode = self::ERROR_NONE;
		}
		
		return !$this->errorCode;
	}
	
	public function getId(){
		return $this->_id;
	}
}
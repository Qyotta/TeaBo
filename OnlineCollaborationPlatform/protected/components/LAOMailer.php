<?php
/**
 * This class sets the default configuration for all mailings
 */
class LAOMailer extends CApplicationComponent{

	private $mailer;

	public function __construct() {
		$this -> mailer = Yii::createComponent('application.extensions.mailer.EMailer');
		$this->setConfiguration();
	}

	private function setConfiguration() {
		$this -> mailer -> IsSMTP();
		// telling the class to use SMTP
		$this -> mailer -> SMTPDebug = 0;
		// enables SMTP debug information (for testing)
		// 1 = errors and messages
		// 2 = messages only
		$this -> mailer -> SMTPAuth = true; // enable SMTP authentication
		$this -> mailer -> SMTPSecure = "tls";// sets the prefix to the servier
		$this -> mailer -> Host = "smtp.googlemail.com"; // sets GMAIL as the SMTP server
		$this -> mailer -> Port = 587; // set the SMTP port for the GMAIL server
		$this -> mailer -> Username = "swplao@googlemail.com"; // GMAIL username
		$this -> mailer -> Password = "qwertz123"; // GMAIL password
		$this -> mailer -> SetFrom('swplao@googlemail.com', 'Look Ahead Online');
		$this -> mailer -> AddReplyTo("swplao@googlemail.com", "Look Ahead Online");
		$this -> mailer -> AltBody = "To view the message, please use an HTML compatible email viewer!";
		$this -> mailer -> CharSet = 'UTF-8'; // set charset to unicode
		// optional, comment out and test

	}

	public function setSubject($string)
	{
		$this -> mailer -> Subject = $string;
	}

	public function setMessage($text)
	{
		$this -> mailer -> MsgHTML($text);
	}

	public function addAddress($address)
	{
		$this -> mailer -> AddAddress($address);
	}

	public function send()
	{
		$this -> mailer -> Send();
	}

}
?>
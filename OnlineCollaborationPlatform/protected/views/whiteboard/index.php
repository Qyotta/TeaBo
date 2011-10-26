<ul>
<?php
if(isset($whiteboards)){
	foreach($whiteboards as $w){
		echo '<li>'.CHtml::link($w->name,array('whiteboard/view','id'=>$w->id)).'</li>';
	}
}

?>
</ul>
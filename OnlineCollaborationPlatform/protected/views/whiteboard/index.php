<ul>
<?php
if(isset($whiteboards)){
	foreach($whiteboards as $w){
		echo '<li>'.CHtml::link($w->name,array('whiteboard','id'=>$w->id)).' 
		'.CHtml::link('delete',array('whiteboard/delete','id'=>$w->id)).'</li>';
	}
}

?>
</ul>
<ul>
<?php
if(isset($whiteboards)){
	foreach($whiteboards as $w){
		echo '<li>'.CHtml::link($w->name,array('whiteboard/view','id'=>$w->id)).' 
		'.CHtml::link('delete',array('whiteboard/delete','id'=>$w->id)).'</li>';
	}
}else{
	echo '<p>No whiteboard exist.</p>';
}

?>
</ul>
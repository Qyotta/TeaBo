<ul>
<?php
if(isset($whiteboards) && count($whiteboards)>0){
	foreach($whiteboards as $w){
		echo '<li>'.CHtml::link($w->name.'(#'.$w->id.')',array('whiteboard/view','id'=>$w->id)).' 
		'.CHtml::link('delete',array('whiteboard/delete','id'=>$w->id)).'</li>';
	}
}else{
	echo '<p>No whiteboard exist.</p>';
}

?>
</ul>
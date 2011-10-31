<h2>Hallo <span><?php echo $model->firstname; ?></span></h2> <?php echo CHtml::link('[Logout]',array('site/logout'),array('class'=>'logout')); ?>

<?php
$whiteboards = User::model()->findByPK(Yii::app()->user->id)->whiteboards;       
if(isset($whiteboards) && count($whiteboards)>0){
    if(count($whiteboards)>0) echo "<ul>";
    foreach($whiteboards as $w){
        echo '<li>'.CHtml::link($w->name.'(#'.$w->id.')',array('whiteboard/view','id'=>$w->id)).' 
        '.CHtml::link('[x]',array('whiteboard/delete','id'=>$w->id)).'</li>';
    }
    if(count($whiteboards)>0) echo "</ul>";
}else{
    echo '<p>No whiteboard exist.</p>';
}
?>


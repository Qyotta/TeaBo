<nav class="bottomNavigation">
    <ul>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/pin_map.png" alt="Get URL" title="Get URL" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/zoom.png" alt="Search" title="Search" /></a></li>
    </ul>
    <ul class="right">
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/calendar.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/chart_line.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/checkbox_checked.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/doc_empty.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/music.png" alt="Search" title="Search" /></a></li>
        <li> 
            <?php 
            echo CHtml::link(
            '<img src="'.Yii::app()->request->baseUrl.'/images/icons/notepad.png" alt="postIt" title="create new postIt" />',
            array('postIt/create','whiteboardId'=>Yii::app() -> controller -> activeWhiteboardId ));
            ?>
        </li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/pencil.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/picture.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/preso.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/spechbubble_sq_line.png" alt="Search" title="Search" /></a></li>
        <li><a href="#"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/icons/tag.png" alt="Search" title="Search" /></a></li>
    </ul>
</nav>
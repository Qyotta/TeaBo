var toolTipCnt = 0,
	toolTips = null;

function closeToolTip() {
	//TODO: submit value
	$(toolTips[toolTipCnt-1]).fadeOut(500);
}

function nextToolTip() {
	if(toolTipCnt===0) {
		$(toolTips[0]).fadeIn(500);
		toolTipCnt++;
	} else {
		$(toolTips[toolTipCnt-1]).fadeOut(500,function() {
			$(toolTips[toolTipCnt]).fadeIn(500);
			toolTipCnt++;
		});
	}	
}

function prevToolTip() {	
	if(!toolTipCnt)
		return;
	if(toolTipCnt===toolTips.length)
		closeToolTip();
	
	$(toolTips[toolTipCnt-1]).fadeOut(500,function() {
		$(toolTips[toolTipCnt-2]).fadeIn(500);
		toolTipCnt--;
	});
}

$(document).ready(function() {
	
	toolTips = $('#startscreen div[data-type="tooltip"]');
	nextToolTip();
	
	$('#startscreen .closeToolTip').click(function(){
		closeToolTip();
	});
	
	$('#startscreen .nextToolTip').click(function() {
		nextToolTip();
	});
	
	$('#startscreen .prevToolTip').click(function() {
		prevToolTip();
	});
	
	
});

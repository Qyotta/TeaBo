
var toolTipCnt = 0,
    toolTips = null;

//TODO commenting
/**
* 
*/
function closeToolTip() {
    $.ajax({
        url: basePath+"/user/setToolTipFlag.htm",
        type: 'POST',
        data: 'value='+$('#showAgain').is(':checked')
    });
    $(toolTips[toolTipCnt-1]).fadeOut(500);
}

//TODO commenting
/**
* 
*/
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

//TODO commenting
/**
* 
*/
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

$(function($) {
    toolTips = $('#startscreen div[data-type="tooltip"]');
    $.ajax({
        url: "/de.bht.swp.lao.ocp/user/showAgain.htm",
        type: 'POST',
        success: function(jsonData) {
            alert(jsonData);
        },
        error: function(jsonData) {
            if(jsonData.responseText.substr(10,4) == "true")
                nextToolTip();
        }
    });
    
    $('#startscreen .closeToolTip').click(function(){ closeToolTip(); });
    $('#startscreen .nextToolTip').click(function() { nextToolTip(); });
    $('#startscreen .prevToolTip').click(function() { prevToolTip(); });
    $('.bottomNavigation a[href=showToolTips]').click(function() {
        toolTipCnt = 0;
        nextToolTip();
        return false;
    });
});

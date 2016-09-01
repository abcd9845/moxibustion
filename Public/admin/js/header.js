var cr_list=[];
cr_list[1] = '身份证';
cr_list[2] = '护照';
cr_list[3] = '军官证';
cr_list[4] = '回乡证';

$(function(){
	$("#div_black").css({ opacity: 0.8 });
	if ($.browser.msie && $.browser.version == 6) {
		$('#div_black').css({height: $(document).height()});
	}
	$('#header_tag,#header_tag_list').mouseover(function(){
		$('#header_tag').attr('class','fl_top');
		$('#header_tag_list').show();
	}).mouseout(function(){
		$('#header_tag').attr('class','fl_top_other');
		$('#header_tag_list').hide();
	});
	$('#header_cate,#header_cate_list').mouseover(function(){
		$('#header_cate').attr('class','fl_top_fl');
		$('#header_cate_list').show();
	}).mouseout(function(){
		$('#header_cate').attr('class','fl_top_fl_other');
		$('#header_cate_list').hide();
	});
	$('#header_go,#header_go_list,.arrowdown_other').mouseover(function(){
		$('#header_go_list').show();
	}).mouseout(function(){
		$('#header_go_list').hide();
	});
	
	$('#pbox_alert_close, #pbox_alert_cancel').click(function(){
		$('#pbox_alert, #div_black').fadeOut(200);
	});
	
	$('#search_text').focus(function(){
		$('#search_note').hide();
	}).blur(function(){
		if(!$(this).val()) {
			$('#search_note').show();
		}
	});
});
function pop_alert(msg){
	$('#pbox_alert_text').text(msg);
	$('#pbox_alert, #div_black').show();
}
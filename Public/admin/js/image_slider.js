//轮播索引
var iter = 0;
// 添加图片下方控制点元素并创建轮播
function simpleSlider(navNum) {
	var navElt = '<div class="lunbotext"><ul>';
	for (var i = 0; i < navNum; i++) {
		if (i == 0) {
			navElt += '<li class="zhong"></li>';
		} else {
			navElt += '<li></li>';
		}
	}
	navElt += '</ul></div><div class="lunboleft" id="l_btn"></div><div class="lunboright" id="r_btn"></div>';
	jQuery('#slider').after(navElt);
	setInterval(function () {
		iter++;
		if (iter > navNum - 1) {
			iter = 0;
		}
		showImg();
	}, 2500);
}
// 图片轮播、控制点样式变化
function showImg() {
	jQuery('div.lunbotext li').eq(iter).css({'background-position': "-104px 0px"}).siblings().css({'background-position':" -123px 0px"});
	jQuery('#slider>a').eq(iter).fadeIn(0).siblings().fadeOut(0);
}
jQuery(function ($) {
	// 轮播图总数
	var navNum = jQuery('#slider>a').size();
	// 如果是IE浏览器则使用简单轮播方式，否则调用轮播插件
	if ($.browser.msie) {
		simpleSlider(navNum);
		// 控制点点击
		$('div.lunbotext li').click(function (e) {
			iter = $(this).index();
			showImg();
		});
		// 右侧按钮点击
		$('#r_btn').click(function () {
			iter++;
			if (iter > navNum - 1) {
				iter = 0;
			}
			showImg();
		});
		// 左侧按钮点击
		$('#l_btn').click(function () {
			iter--;
			if (iter < 0) {
				iter = navNum - 1;
			}
			showImg();
		});
	} else {
		$('#slider').nivoSlider({effect: 'fade'});
	}
	// 控制点出现位置居中
	//var pos = $('#div_showimg').width() / 2 - $('div.nivo-controlNav').width() / 2;
	//$('div.nivo-controlNav').css({left: pos});
});
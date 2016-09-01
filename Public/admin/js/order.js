var oform_go = false;
jQuery(function(){
	$(".order_title_samll>span").click(function(){
		window.open('{url app=goods&goods_id=$xl_goods.goods_id}', '_blank');
	}).css('cursor', 'pointer');
	$('input[name^=person_birthday]').datepicker({
		changeMonth:true,
		changeYear:true,
		yearRange:"1950:2013"
	});

	jQuery.validator.addMethod("checkMobile", function(value, element){ return checkMobile(value); });
	jQuery.validator.addMethod("checkCredentials", function(value, element){
		var ctype = $(element).prevAll('input[name^=credentials_type]').val();
		if(ctype == 1){
			return checkIdcard(value, element, $(element).parent().parent().next().children().eq(0), $(element).parent().parent().next().children().eq(1).children());
		} else if (ctype == 2){
			return checkPassport(value);
		} else if (ctype == 3){
            return checkOfficersCertificate(value);
        } else if (ctype == 4){
            return checkHomeCar(value);
        }
	});
	$("#xorder_form").validate({
		highlight : false,
    	unhighlight : false,
    	errorClass : 'wrongTips',
    	errorElement : 'b',
		rules:{
			contacts_name:{ required:true, rangelength:[2,10] },
			contacts_mobile:{ required:true, checkMobile:true },
			contacts_name_ext:{ required:true, rangelength:[2,10] },
			contacts_mobile_ext:{ required:true, checkMobile:true }
		},
		messages:{
			contacts_name:{ required:'请填写姓�?', rangelength:'请填写正确的姓名' },
			contacts_mobile:{ required:'请填写手机号', checkMobile:'请填写正确的手机�?' },
			contacts_name_ext:{ required:'请填写姓�?', rangelength:'请填写正确的姓名' },
			contacts_mobile_ext:{ required:'请填写手机号', checkMobile:'请填写正确的手机�?' }
		},
		submitHandler:function(form){
			if(!$("#checkbox").is(":checked")){
				pop_alert("请阅读相关协议及合同");
				return false;
			}
			if(oform_go){
				$("input[name^=person_name_]").attr("name","person_name[]");
				$("input[name^=person_phone_]").attr("name","person_phone[]");
				$("input[name^=credentials_no_]").attr("name","credentials_no[]");
				$("input[name^=person_birthday]").attr("name","person_birthday[]");
				form.submit();
			} else {
				$('#pbox_order, #div_black').show();
			}
		}
	});
	$('#pboxo_cancel, #pboxo_close').click(function(){
		$('#pbox_order, #div_black').fadeOut(200);
	});
	$('#pboxo_go').click(function(){
		oform_go = true;
		$("#xorder_form").submit();
	});
	
	$('#copy_btn').click(function(){
		var _parent = $(this).parent().parent();
		var i_name = _parent.find('input[name^=person_name_]');
		var i_phone = _parent.find('input[name^=person_phone_]');
		i_name.val($('input[name=contacts_name]').val());
		i_phone.val($('input[name=contacts_mobile]').val());
		i_name.next('.wrongTips').remove();
		i_phone.next('.wrongTips').remove();
	});
	$('.commonUse').hover(function(){
		$(this).children('.showName').show();
	}, function(){
		$(this).children('.showName').hide();
	});

	$('.touristLayerBig a[id^=person_]').click(function(){
		var p_parent = $(this).parents('.touristLayerBig');
		eval('var pinfo='+this.id);
		p_parent.find('input[name^=person_name_]').val(pinfo.person_name);
		p_parent.find('input[name^=person_phone_]').val(pinfo.person_phone);
		p_parent.find('#cr_select').text(cr_list[pinfo.credentials_type]);
		p_parent.find('input[name^=credentials_type]').val(pinfo.credentials_type);
		p_parent.find('input[name^=credentials_no_]').val(pinfo.credentials_no);
		p_parent.find('#sex_select').text(pinfo.person_sex);
		p_parent.find('input[name^=person_sex]').val(pinfo.person_sex);
		p_parent.find('input[name^=person_birthday_]').val(pinfo.person_birthday);
		p_parent.find('b[class=wrongTips]').remove();
	});
	$('#add_p a[id^=person_]').click(function(){
		var p_box = $(this).parents('h2').next();
		eval('var pinfo='+this.id);
		p_box.find('input[name=contacts_name]').val(pinfo.person_name);
		p_box.find('input[name=contacts_mobile]').val(pinfo.person_phone);
		p_box.find('b[class=wrongTips]').remove();
	});
	
	$('b[id=sex_box], b[id=cr_box]').click(function(){
		$(this).children(':eq(1)').toggle();
	});
	$('strong[id=sex_list]>a, strong[id=cr_list]>a').click(function(){
		var s_text=$(this).text();
		var s_val=$(this).attr('val');
		$(this).parent().prev().text(s_text);
		$(this).parent().parent().next('input').val(s_val);
	});
	$(document).click(function(event) {
		if (!$(event.target).closest('b[id=sex_box]').length) {
			$('b[id=sex_box]').each(function(){
				$(this).children(':eq(1)').hide();
			});
		};
		if (!$(event.target).closest('b[id=cr_box]').length) {
			$('b[id=cr_box]').each(function(){
				$(this).children(':eq(1)').hide();
			});
		};
	});
});
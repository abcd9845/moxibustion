/**
 * Created by mr on 15/1/24.
 */
(function($){

    //是否必填
    function hasRequired(inpt){
        var input = $(inpt);
        if($.trim(input.val()) === ''){
            return false;
        }else{
            return true;
        }
    }

    //是否为数字
    function isNumber(inpt,flag){
        flag = flag || false;
        if(flag){
            var input = $(inpt);
            var reg = /^\d+$/;
            return reg.test($.trim(input.val()));
        }else{
            return true;
        }

    }

    function addErrTips(obj,msg){
        var $_obj = $(obj);
        if($_obj.attr('errTips') != 'true'){
            $_obj.addClass('inputErr').attr('errTips',true);
            var msgTarget = $('<span class="error-tip">'+msg+'</span></td>');
            $_obj.after(msgTarget);
            $.data(obj,'ErrtipsMsg-'+option['ruleName'],msgTarget);
        }
    }

    function addTips(obj,msg){
        var $_obj = $(obj);
        if($_obj.attr('errTips') != 'true' && $_obj.attr('Tips') != 'true'){
            $_obj.attr('Tips',true);
            var msgTarget = $('<span class="tip">'+msg+'</span></td>');
            $_obj.after(msgTarget);
            $.data(obj,'tipsMsg-'+$_obj.attr('id'),msgTarget);
        }
    }

    function removeTips(obj){
        $(obj).removeAttr('Tips');
        $.data(obj,'tipsMsg-'+$(obj).attr('id')).remove();
    }

    function removeErrTips(obj,target,option){
        $('#'+option.name).removeClass('inputErr');
        obj.removeAttr('errTips');
        $.data(target,'ErrtipsMsg-'+option.name).remove();
    }

    function initValidate(target){
        var targets = $.data(target,'inputValidate').options;
        for(var i=0;i<targets.length;i++){

            function bindEvent(option){
                var tagName = '#'+option.fieldName;
                $(tagName).unbind('.'+option.fieldName);

                $(tagName).focus(function(){
                    if($(this).attr('Tips') != 'true'){
                        addTips(this,option.tip);
                    }
                });

                $(tagName).blur(function(){
                    console.log('blur')
                    removeTips(this);
                    var rules = option.rule;
                    for(var j=0;j<rules.length;j++){
                        //console.log(rules[j].ruleName == 'required')
                        removeTips($(tagName));


                        if(rules[j].ruleName == 'required'){
                            if(!hasRequired(tagName)){
                                rules[j].msg = rules[j].msg || msg.required;
                                console.log(rules[j]);
                                addErrTips($(tagName),rules[j]);
                                break;
                            }else{
                                removeErrTips($(tagName),target,rules[j]);
                            }
                        }


                        //if(!hasRequired(tagName,option.required)){
                        //    option.msg = option.msg || msg.required;
                        //    addTips($(this),target,option);
                        //    break;
                        //}else{
                        //    removeTips($(this),target,option);
                        //}
                        //
                        //
                        //if(option.isNumber){
                        //    if(!isNumber(tagName,option.isNumber)){
                        //        option.msg = option.msg || msg._number;
                        //        addTips($(this),target,option);
                        //        break;
                        //    }else{
                        //        removeTips($(this),target,option);
                        //    }
                        //}
                    }




                    //if(!hasRequired(tagName,option.required)){
                    //    option.msg = option.msg || msg.required;
                    //    addTips($(this),target,option);
                    //}else{
                    //    removeTips($(this),target,option);
                    //}
                    //
                    //if(option.isNumber){
                    //    if(!isNumber(tagName,option.isNumber)){
                    //        option.msg = option.msg || msg._number;
                    //        addTips($(this),target,option);
                    //    }else{
                    //        removeTips($(this),target,option);
                    //    }
                    //}

                })
            }

            bindEvent(targets[i]);






        }
    }

    $.fn.inputValidate = function(options, param){
        options = options || {};
        return this.each(function(){
            $.data(this,'inputValidate',{
                options:options
            });
            initValidate(this);
        });
    };

    var msg = {
         required:'必填 请输入相应内容'
        ,_number:'请输入数字'
    }

})(jQuery);
/**
 * Created with JetBrains PhpStorm.
 * User: kk
 * Date: 13-8-28
 * Time: 下午4:44
 */
function getSelectOptAttr(obj,field){
    if(obj.val() != ''){
        return obj.find('option[value='+obj.val()+']').attr(field);
    }else{
        return 0;
    }
}

function getSelText(obj){
    if(obj.val() != ''){
        return obj.find('option[value='+obj.val()+']').text();
    }else{
        return '';
    }
}

function U() {
    var url = arguments[0] || [];
    var param = arguments[1] || {};
    var url_arr = url.split('/');

    if (!$.isArray(url_arr) || url_arr.length < 2 || url_arr.length > 3) {
        return '';
    }

    if (url_arr.length == 2)
        url_arr.unshift(_GROUP_);

    var pre_arr = ['g', 'm', 'a'];

    var arr = [];
    for (d in pre_arr)
        arr.push(pre_arr[d] + '=' + url_arr[d]);

    for (d in param)
        arr.push(d + '=' + param[d]);

    return _APP_+'?'+arr.join('&');
}

function getTotal(total,discount,kdf){
    var returnStr = "合计：￥"+order_total(total,discount).toFixed(2);

    if(kdf)
        returnStr += "(配送费"+kdf+"元)";

    if(discount)
        returnStr += "(已优惠"+discount+"元)";


    return returnStr;
}

function order_total(total,discount){
    if((total - discount) <=0){
        return 0.1
    }else{
        return total - discount
    }
}
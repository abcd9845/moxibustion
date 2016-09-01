Number.prototype.toFixed=function (d) {
    var s=this+"";
    if(!d)d=0;
    if(s.indexOf(".")==-1)s+=".";
    s+=new Array(d+1).join("0");
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
        var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g);
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

        }if(b)s=s.substr(1);
        return (pm+s).replace(/\.$/,"");
    }return this+"";

};

var GSTools = GSTools || {};

GSTools.roleMap = {
    0:'def'
    ,1:'mj'
    ,2:'dz'
}

GSTools.totalTactics = {
    mj:function(array,param){
        var total = 0,fruieTotal = 0,otherTotal = 0,youhui = 0,com_youhui = 0,noneTotal=0;
        var company_discount_flag = param['company_discount_flag'];
        var company_discount = param['company_discount'];
        for(var i in array){
            if(!array[i]['basic_type_id']){
                param['initCar']();
                return {price:0};
            }else{
                //if(array[i]['basic_type_id'] == 2 || array[i]['basic_type_id'] == 3){
                if(array[i]['basic_type_id'] == 8){
                    fruieTotal = Number(fruieTotal).add(array[i].count.mul(array[i].price))
                }else if(array[i]['basic_type_id'] == 1) {
                    noneTotal = Number(otherTotal).add(array[i].count.mul(array[i].price))
                }else{
                    otherTotal = Number(otherTotal).add(array[i].count.mul(array[i].price))
                }
            }
        }

        var man = param['man'] || 10;
        var jian = param['jian'] || 5;

        youhui = (parseInt(Number(fruieTotal).div(Number(man)))*jian).toFixed(2);
        total = parseFloat(Number(fruieTotal).ssub(youhui)).toFixed(2);


        if(company_discount_flag == 1){
            com_youhui = Number(otherTotal).mul(1-company_discount).toFixed(2);
            otherTotal = Number(otherTotal).mul(company_discount);
        }

        return {
            price:(noneTotal+parseFloat(total)+parseFloat(otherTotal)).toFixed(2)
            ,youhui:youhui
            ,yuanjia:(noneTotal+fruieTotal+otherTotal).toFixed(2)
            ,com_youhui:com_youhui
            ,com_youhui_flag:company_discount_flag
            ,com_discount:company_discount
            ,man:man
            ,jian:jian

        }
    }
    ,dz:function(array,param){
        var total = 0;
        var yuanTotal = 0;
        for(var i in array){
            if(!array[i]['basic_type_id']){
                param['initCar']();
                return {price:0};
            }else{
                var price = param['itemTactics'][param['selRole']](array[i].price,param);
                //if(array[i]['basic_type_id'] == 2 || array[i]['basic_type_id'] == 3){
                    total = (Number(total).add(array[i].count.mul(price))).toFixed(2);
                //}else{
                //    total = (Number(total).add(array[i].count.mul(array[i].price))).toFixed(2);
                //}
                yuanTotal = (Number(yuanTotal).add(array[i].count.mul(array[i].price))).toFixed(2);
            }
        }
        return {price:total,yuanjia:yuanTotal}
    }
    ,def:function(array,param){
        var total = 0,fruieTotal = 0,otherTotal = 0,youhui = 0,com_youhui = 0,noneTotal=0;
        var company_discount_flag = param['company_discount_flag'];
        var company_discount = param['company_discount'];
        for(var i in array){
            if(!array[i]['basic_type_id']){
                param['initCar']();
                return {price:0};
            }else{
                //if(array[i]['basic_type_id'] == 2 || array[i]['basic_type_id'] == 3){
                if(array[i]['basic_type_id'] == 8){
                    fruieTotal = Number(fruieTotal).add(array[i].count.mul(array[i].price))
                }else if(array[i]['basic_type_id'] == 1) {
                    noneTotal = Number(noneTotal).add(array[i].count.mul(array[i].price))
                }else{
                    otherTotal = Number(otherTotal).add(array[i].count.mul(array[i].price))
                }
            }
        }


        youhui = 0;
        total = parseFloat(Number(fruieTotal).ssub(youhui)).toFixed(2);


        if(company_discount_flag == 1){
            com_youhui = Number(otherTotal).mul(1-company_discount).toFixed(2);
            otherTotal = Number(otherTotal).mul(company_discount);
        }

        return {
            price:(noneTotal+parseFloat(total)+parseFloat(otherTotal)).toFixed(2)
            ,youhui:youhui
            ,yuanjia:(noneTotal+fruieTotal+otherTotal).toFixed(2)
            ,com_youhui:com_youhui
            ,com_youhui_flag:company_discount_flag
            ,com_discount:company_discount
        }
    }
}

GSTools.itemTactics = {
    mj:function(price){
        return price;
    }//满$减$
    ,dz:function(price,param){
            param = param || {}
            var zhekou = param['zhekou'] || 1
            price =  Number(price).mul(zhekou).toFixed(2)
            return price;
        }//折扣$
    ,def:function(price){
            return price
        }//默认不优惠
}

GSTools.Car || (GSTools.Car = {
    CAR:'_car'
    ,userID:''
    ,carItem:[]
    ,total:0
    ,itemCount:5
    ,discount:0
    ,expense:0
    ,selRole:'def'
    ,param:{}
    ,company_discount_flag:0
    ,company_discount:1
    ,setExpense:function(expense){
        this.expense = expense;
    }
    ,defExpense:function(){
        this.expense = 0;
    }
    ,getNow:function(){
        var array = this.getCar() || [];
        var _flag = true;
        if(array.length > 0){
            for(var i in array){
                _flag = array[i].isnow==1?true:false;
            }
        }
        return _flag;
    }
    ,checkNow:function(flag){
        var array = this.getCar() || [];
        var _flag = true;
        if(array.length > 0){
            for(var i in array){
                if(flag != array[i].isnow){
                    _flag = false;
                    break;
                }
            }
        }
        return _flag;
    }
    ,getTotal:function(){
        this.total = 0;

        var array = this.getCar() || [];

        if(array.length > 0){
            this.param = this.param || {}
            this.param['selRole'] = this.selRole;
            this.param['itemTactics'] = GSTools.itemTactics;
            this.param['initCar'] = this.initCar;
            this.total = GSTools.totalTactics[this.selRole](array,this.param);
        }else{
            this.total = {price:0,yuanjia:0};
        }

        return this.total;
    }
    ,getTotalMsg:function(countTag,countTag_small,showTag){
        this.total = 0;

        var array = this.getCar() || [];

        if(array.length > 0){
            this.param = this.param || {}
            this.param['selRole'] = this.selRole;
            this.param['itemTactics'] = GSTools.itemTactics;
            this.param['company_discount_flag'] = this.company_discount_flag
            this.param['company_discount'] = this.company_discount
            this.param['initCar'] = this.initCar;

            this.total = GSTools.totalTactics[this.selRole](array,this.param);
        }else{
            this.total = {price:0,yuanjia:0};
        }

        if(this.total['price'] == 0 && this.getItemCount() == 0){
            if(countTag)
                $('#'+countTag).html(0);
            if(countTag_small)
                $('#'+countTag_small).html(0);
            if(showTag){
                $('#'+showTag).html('请选购');
            }
        }else{
            if(this.discount == 0){
                if(countTag){
                    $('#'+countTag).html(this.getItemCount());
                }
                if(countTag_small)
                    $('#'+countTag_small).html(this.getItemCount());
                if(showTag){
                    if(Number(this.expense) > 0){

                        $('#'+showTag).html('合计'+(Number(this.total['price']).add(Number(this.expense)).toFixed(2))+'元(含'+Number(this.expense)+'元送货费)');
                    }else
                        $('#'+showTag).html('合计'+(Number(this.total['price']).add(Number(this.expense)).toFixed(2))+'元');
                }
            }else{
                if((Number(this.total['price']).ssub(Number(this.discount) + Number(this.expense))) <= 0){
                    if(countTag){
                        $('#'+countTag).html(this.getItemCount());
                    }
                    if(countTag_small)
                        $('#'+countTag_small).html(this.getItemCount());
                    if(showTag){
                        $('#'+showTag).html('合计0.01元');
                    }
                }else{
                    if(countTag){
                        $('#'+countTag).html(this.getItemCount());
                    }
                    if(countTag_small)
                        $('#'+countTag_small).html(this.getItemCount());
                    if(showTag){
                        if(Number(this.expense)>0)
                            $('#'+showTag).html('合计'+(Math.round(Number(this.total['price']).add(Number(this.expense))).toFixed(2))+'元(含'+Number(this.expense)+'元送货费)');
                        else
                            $('#'+showTag).html('合计'+(Math.round(Number(this.total['price']).add(Number(this.expense))).toFixed(2))+'元');
                    }
                }
            }
        }
        return this.total;
    }
    ,delCar:function(id){
        var array = this.getCar() || [];
        if(array.length > 0){
            for(var i in array){
                if(array[i].id == id){
                    if(array[i].count > 1){
                        array[i].count--;
                        break;
                    }else if(array[i].count == 1){
                        array.splice(i,1);
                        break;
                    }
                }
            }
        }
        store.set(this.userID+this.CAR,array);
    }
    ,getCar:function(){
        return store.get(this.userID+this.CAR)
    }
    ,setCar:function(carItem){
        var array = this.getCar() || [];
        if(array.length == 0){
            array.push(carItem);
        }else{
           var addFlag = true;
           for(var i in array){
               if(array[i].id == carItem.id){
                   array[i].count++;
                   addFlag = false;
                   break;
               }
           }
           if(addFlag){
               array.push(carItem);
           }
        }
        store.set(this.userID+this.CAR,array);
    }
    ,getCount:function(){
        return this.getCar()?this.getCar().length:0;
    }
    ,getItem:function(id){
        var array = this.getCar() || [];
        for(var i in array){
            if(array[i].id == id){
                return array[i]
            }
        }
        return null;
    }
    ,getItemCount:function(){
        var array = this.getCar() || [];
        var c = 0;
        for(var i in array){
                //if(array[i].count < this.itemCount){
            c+=array[i].count;
        }
        return c;
    }
    ,addItemCount:function(id){
        var array = this.getCar() || [];
        var c = 0;
        var addFlag = true;
        var carItem = {}
        for(var i in array){
            if(array[i].id == id){
                //if(array[i].count < this.itemCount){
                    array[i].count++;
                    c = array[i].count;
                    this.total = Number(this.total).add(array[i].price)
                    store.set(this.userID+this.CAR,array);
                    addFlag = false;
                    break;
                //}else{
                //    c = array[i].count;
                //    alert('每种商品最多购买'+this.itemCount+'个')
                //}
            }
        }
        return c;
    }
    ,subItemCount:function(id){
        var array = this.getCar() || [];
        var c = 0;
        var addFlag = true;
        var carItem = {}
        for(var i in array){
            if(array[i].id == id){
                if(array[i].count > 1){
                    array[i].count--;
                    c = array[i].count;
                    this.total = Number(this.total).add(array[i].price)
                    store.set(this.userID+this.CAR,array);
                    addFlag = false;
                    break;
                }else{
                    array.splice(i,1);
                    store.set(this.userID+this.CAR,array);
                    c = 0;
                }
            }
        }
        return c;
    }
    ,initCar:function(){
        return store.remove(this.userID+this.CAR)
    }
});

GSTools.ModelLoading || (GSTools.ModelLoading = {
    modelPanelHTML:'<div style="position: fixed;top:0;left:0;right:0;bottom:0;background:#000;opacity: 0.2;z-index:999999;"></div>'
    ,loadingHTML:'<div style="width:90px;height:90px;background: #FFF;position:relative;z-index:9999999;margin:120px auto;border-radius: 80px;text-align:center;">' +
                    '<img style="margin:20px auto;display: block;position: relative;top:15px;" src="/Public/images/ajax-loader1.gif" align="center"/><p>请等待</p>' +
             '</div>'
    ,panel:'<div style="display:none;width:100%;position: fixed;top:0;left:0;right:0;bottom:0;z-index:999999;" id="gs_modelpanel"></div>'
    ,init:function(){
        var panel = $(this.panel)
        panel.append(this.loadingHTML);
        panel.append(this.modelPanelHTML);
        $('body').append(panel);
    }
    ,show:function(){
        $('#gs_modelpanel').show();
    }
    ,hidden:function(){
        $('#gs_modelpanel').hide();
    }
    ,remove:function(){
        $('#gs_modelpanel').remove();
    }
    ,showWithoutLoad:function(){
        $('#gs_modelpanel').show();
        $('#gs_modelpanel').find('img').parent().hide();
    }
})

//加法函数
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}
//给Number类型增加一个add方法，，使用时直接用 .add 即可完成计算。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};

//减法函数
function Subtr(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//给Number类型增加一个add方法，，使用时直接用 .sub 即可完成计算。
Number.prototype.ssub = function (arg) {
    return Subtr(this, arg);
};

//乘法函数
function accMul(arg1, arg2) {
    //var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    //try {
    //    m += s1.split(".")[1].length;
    //}
    //catch (e) {
    //}
    //try {
    //    m += s2.split(".")[1].length;
    //}
    //catch (e) {
    //}
    //return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);


    return Number(arg1) * 1000000 * Number(arg2) / 1000000;
}
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};

//除法函数
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//给Number类型增加一个div方法，，使用时直接用 .div 即可完成计算。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};

<?php
    if(C('LAYOUT_ON')) {
        echo '{__NOLAYOUT__}';
    }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <title>沽尚农庄</title>
  
    <link rel="stylesheet" href="__PUBLIC__/css/farm.core.css">    
    <link rel="stylesheet" href="__PUBLIC__/css/bootstrap.css">
    <link rel="stylesheet" href="__PUBLIC__/css/bootstrap-theme-farm.css">
    <!--[if lt IE 9]>
      <link rel="stylesheet" href="__PUBLIC__/css/ie8.css">
      <script type="text/javascript" src="__PUBLIC__/js/ie/html5.js"></script>
      <script type="text/javascript" src="__PUBLIC__/js/ie/respond.min.js"></script>
      <script type="text/javascript" src="assets/plugins/charts-flot/excanvas.min.js"></script>
    <![endif]-->

  <block name="css-content">
    <link rel="stylesheet" href="__PUBLIC__/css/login_pad.css"/>
    <style type="text/css">
        *{ padding: 0; margin: 0; }
        .system-message{ padding: 24px 48px; }
        .system-message h1{ font-size: 100px; font-weight: normal; line-height: 120px; margin-bottom: 12px; }
        .system-message .jump{ padding-top: 10px}
        .system-message .jump a{ color: #333;}
        .system-message .success,.system-message .error{ line-height: 1.8em; font-size: 36px }
        .system-message .detail{ font-size: 12px; line-height: 20px; margin-top: 12px; display:none}
    </style>
</block>

</head>
<body>
<include file="Common@Shared/nav" />
<div id="page-content" style="margin-top: 50px; position: relative">  
    <div id="wrap">
        <block name="page-content">
            <section class="container" id="show_content" style="text-align: center">
                <div class="system-message" style="margin-top: 150px">
                    <present name="message">
                        <p class="success"><span class="glyphicon glyphicon-ok-sign" style="color: #00cc00;margin-right: 10px"></span><?php echo($message); ?></p>
                    <else/>                        
                        <p class="error"><span class="glyphicon glyphicon-remove-sign" style="color: #ff0000;margin-right: 10px"></span><?php echo($error); ?></p>
                    </present>
                    <p class="detail"></p>
                    <p class="jump">
                        <span style="margin-right: 10px;">页面</span>
                        <span style="margin-right: 10px;"><b id="wait" style="color: #ff6600;font-size: 30px"><?php echo($waitSecond); ?></b></span>
                        <span>秒后<a id="href" href="<?php echo($jumpUrl); ?>" style="margin-left: 10px">跳转</a></span>
                    </p>
                </div>
            </section>
        </block>
    </div>  
</div>
<include file="Common@Shared/bottom" />


<script src="__PUBLIC__/js/jquery-1.11.1.js"></script>
<script src="__PUBLIC__/js/less.min.js"></script>
<script src="__PUBLIC__/js/bootstrap.min.js"></script>
<script src="__PUBLIC__/js/custom.js"></script>
<script type="text/javascript">
  var PATH_INFO = '__ACTION__';
  $(function(){
    $('#show_content').css('min-height',$(window).height()-$('#page_bottom').height()-$('nav').height()-130);
    $('#bottom_section').show();
  })
</script>
<block name="js-content">
<script type="text/javascript">
  (function(){
    var wait = document.getElementById('wait'),href = document.getElementById('href').href;
    var interval = setInterval(function(){
            var time = --wait.innerHTML;
            if(time <= 0) {
                    location.href = href;
                    clearInterval(interval);
            };
    }, 1000);
    })();
</script>
</block>
</body>
</html>
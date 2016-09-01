;$(function() {
  $(".check-all").click(function() {
    $(".ids").prop("checked", this.checked);
  });
  
  $(".ids").click(function() {
    var option = $(".ids");
    option.each(function(i) {
      if (!this.checked) {
        $(".check-all").prop("checked", false);
        return false;
      } else {
        $(".check-all").prop("checked", true);
      }
    });
  });

  $('.ajax-get').click(function(e) {
    e.preventDefault();
    var target;
    var that = this;
    if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
      $.get(target).success(function(data) {
        $.pnotify({
          title: data.info,
          type: data.status == 1 ? 'success' : 'error'
        });
        setTimeout(function() {
          if (data.url) {
            location.href = data.url;
          } else if (!$(that).hasClass('no-refresh')) {
            location.reload();
          }
        }, 1500);
      });
    }
    return false;
  });
  
  $('.ajax-post').click(function() {
    var target;
    var that = this;
    var container= $('#' + $(this).data('relate'))
    if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
      $.post(target).success(function(data) {
        $.pnotify({
          title: data.info,
          type: data.status == 1 ? 'success' : 'error'
        });
        setTimeout(function() {
          if (data.url) {
            location.href = data.url;
          } else if (!$(that).hasClass('no-refresh')) {
            location.reload();
          }
        }, 1500);
      });
    }
    return false;
  });
  
  $('#submitBtn').click(function(){
    $('#theForm').submit();
    return false;
  });
  
  $('#backBtn').click(function(){
    window.history.back();
  });
});

(function($, window, document, undefined){
  $('.slidebox').each(function(index) {
    var el = $(this);
    el.find('.slider').width((el.find('.slide').length * 232.66667) + 10);
    var paused = false;
    for(var i = 1; i < el.find('.slide').length -1; i++){
      el.find('.slide').eq(i).attr('id', 'sli_' + i);
      el.find('.dot-box').append($('<a />').addClass('dot').attr('href', '#sli_' + i));
    }
    el.find('.dot').eq(0).addClass('on');
    el.find('.dot').on('click', function(e){
      e.preventDefault();
      el.find('.dot.on').removeClass('on');
      $(this).addClass('on');
      var t = $($(this).attr('href'));
      if($('.no-csstransitions').length > 0) {
        el.find('.slider').animate({ left:(t.get(0).offsetLeft * -1) + 232.66667}, 500)
      } else {
        el.find('.slider').css('left', (t.get(0).offsetLeft * -1) + 232.66667);
      }
    });

    el.on('mouseenter', function(e){
      paused = true;
    }).on('mouseleave', function(e){
      paused = false;
    });

    el.find('[href="#prev"]').on('click', function(e){
      e.preventDefault();
      var i = el.find('.dot.on').index() - 1;
      if(i < 0){
        i = el.find('.dot').length - 1;
      }
      el.find('.dot').eq(i).trigger('click');
    });

    el.find('[href="#next"]').on('click', function(e){
      e.preventDefault();
      var i = el.find('.dot.on').index();
      i++;
      if(i > el.find('.dot').length - 1){
        i = 0;
      }
      el.find('.dot').eq(i).trigger('click');
    });

    window.setInterval(function(){
      if(!paused){
        var i = el.find('.dot.on').index();
        i++;
        if(i > el.find('.dot').length - 1){
          i = 0;
        }
        el.find('.dot').eq(i).trigger('click');
      }
    }, 3000);
  });
}(jQuery, this, this.document));

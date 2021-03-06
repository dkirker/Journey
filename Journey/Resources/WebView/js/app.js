(function() {
  var self = window.Path = {
    templates: {
      feed: $('#feed_template').text()
    , moment: $('#moment_template').text()
    }

  , refreshing: false

  , init: function() {
      Path.initialized = true;
      Path.killScroll = false;
      Path.loadOldMomentsComplete = false;

      Path.handleWindowScroll();
      Path.handleKeyup();
      //window.setInterval(self.didClickRefreshButton, 15000);
      $('.friend.dot').cycle({fx: 'fade'});
    }

  , renderTemplate: function(name, object, atTop) {
      var $content = $('#content');
      if($content.children('.moments').length == 0) {
        $content.html(_.template(self.templates[name], object));
        $('abbr.timeago').timeago();
        $('.friend.dot').cycle({fx: 'fade'});
        $('#refresh_button').click(self.didClickRefreshButton);
      } else {
        // just prepend moments
        var $newMomentHTML = $(_.map(object.moments, function(m) {
          return _.template(self.templates.moment, {m: m});
        }).join(''));
        $newMomentHTML.find('abbr.timeago').timeago();
        $newMomentHTML.find('.friend.dot').cycle({fx: 'fade'});
        if(atTop) {
          $content.find('.moments').prepend($newMomentHTML);
        } else {
          Path.removeLoadingMessage();
          $content.find('.moments').append($newMomentHTML);
          Path.killScroll = false;
        }
      }
      self.didCompleteRefresh();
    }

  , didClickRefreshButton: function() {
      if(!self.refreshing) {
        document.location.replace('#refresh_feed');
        self.refreshing = true;
        self.animateRefreshButton(true);
      }
      return false;
    }

  , didCompleteRefresh: function() {
      self.removeHashFragment();
      self.refreshing = false;
      self.animateRefreshButton(false);
    }

  , animateRefreshButton: function(animate) {
      var $imgs = $('#refresh_button img');
      if(animate) {
        $imgs.addClass('loading');
      } else {
        $imgs.removeClass('loading');
      }
    }

  , handleWindowScroll: function() {
      $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        if(scrollTop + 200 >= ($(document).height() - $(window).height())) {
          if(Path.killScroll === false && Path.loadOldMomentsComplete === false) {
            Path.killScroll = true;
            Path.showLoadingMessage();
            document.location.replace('#load_old_moments');
          }
        } else if(scrollTop <= 243) {
          document.location.replace('#clear_status_item_highlight');
        }
      });
    }

  , handleKeyup: function() {
	  $(window).keyup(function(e) {
		  var target = $(e.target);

		  //if is comment add
		  if(target.hasClass('comment-input')) {
			//if is enter key, add comment
			if(e.keyCode === 13) {
				var mid = e.target.getAttribute('moment-id');
				var comment = target.val();
				//$('ul.moments').html(comment);
				document.location.replace('#create_comment?mid=' + mid + '&comment=' + comment);
				//self.didClickRefreshButton();
				//document.location.replace('#refresh_feed');
			}
		  }
	});
  }
	, log: function(url) {
		self.didClickRefreshButton();
		if(url) {
			var m = $('ul.moments');
			if(m) {
				//m.html('url' + url);
			}
		}
	}

  , showLoadingMessage: function() {
      $('ul.moments').append('<li class="moment fetching"></li>');
    }

  , removeLoadingMessage: function() {
      $('.moments .fetching').remove();
    }

  , removeHashFragment: function() {
      document.location.replace('#_');
    }

  };
}());


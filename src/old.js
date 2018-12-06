import $ from 'jquery';
import { 
	sortByFrequency,
	deleteFav,
	isShouldNotRender,
	domain,
	toast,
	isAlmostThere,
	isAndroid,
	showWebview,
	lazyShow
} from './old.child';

window.renderRecommendation = function(images) {
  var html;
  html = sortByFrequency(images.serialize()).reduce(function(prev, image) {
    return prev + (isShouldNotRender(image) ? "" : "<a\nhref=\"/images?imageID=" + image.id + "\"\nstyle=\"background-image: url(" + image.url + ")\"></a>");
  }, "");
  if (!html) {
    return;
  }
  return $('.component-images-horizontal').html(html).closest('.area-recommendation').show(300);
};

window.getHtmlFav = function(isTrue) {
  return "<div class=\"component-fav " + isTrue + "\">\n	<span>♡</span>\n	<span>♥</span>\n</div>";
};

window.renderImages = function() {
	return;
  var html, j;
  j = 0;
  html = "";
  if (window.dat.session.userID) {
    html = "<div class=\"outer additional\">\n	<div class=\"inner\">\n		<i class=\"fas fa-plus\"></i>\n	</div>\n</div>";
    j++;
  }
  html += window.dat.images.reduce(function(prev, dat, i) {
    var s, t;
    s = window.getHtmlFav(!!window.dat.favorites.filter(function(fav) {
      return dat.id === parseInt(fav.imageID);
    }).length);
    t = (j + i) % 12 ? "" : "<div class=\"message\">\n	スマホのホーム画面にこのアプリを追加することができるのです\n	<i>(ここをタップ)</i>\n</div>";
    return prev + (t + `
      <div
        style="display: none"
        class="outer fas fa-unlink"
        data-imageID="${dat.id}">
        <a
          class="inner"
          href="/images?imageID=${dat.id}"
          style="background-image: url(${dat.url})">
        </a>
        ${s}
        <div class="favoriteNum">${dat.favorite ? dat.favorite : ''}</div>
      </div>
    `);
  }, "");
  $('#component-images').html(html).find('.component-fav').on('click', function() {
    var imageID;
    imageID = $(this).closest('.outer').data('imageid');
    if ($(this).is('.true')) {
      return deleteFav(imageID).done((function(_this) {
        return function() {
          return $(_this).removeClass('true');
        };
      })(this));
    } else {
      return $.post(domain + '/favorites', {
        imageID: imageID
      }).fail(function(dat) {
        return toast(dat.responseJSON.toast);
      }).done((function(_this) {
        return function() {
          return $(_this).addClass('true');
        };
      })(this));
    }
  });

  $('#component-images > .outer').filter(isAlmostThere()).show();
  $(document).on('scroll', function() {
    $('#component-images > .outer').filter(isAlmostThere()).fadeIn();
  });

  $('#component-images').find('.message').on('click', function() {
    if (isAndroid()) {
      return showWebview('https://www.youtube.com/embed/f9MsSWxJXhc');
    } else {
      return showWebview('https://www.youtube.com/embed/8iueP5sRQ-Y');
    }
  });
  return lazyShow('#component-images .outer');
};

window.renderImage = function(image) {
  var html;
  html = "<div class=\"fluid\" data-imageID=\"" + image.id + "\">\n	<img src=\"" + image.url + "\">\n</div>";
  return $('#component-images').html(html);
};

import $ from 'jquery';
import {
	getUrlParameter,
	existParameter,
	countUp,
	startLoading,
	stopLoading,
	deleteFav,
	domain,
	toast
} from './_util';
import Toggle from './Toggle';
// import { renderImage, renderImages } from './gridList';

export function renderLayer2Row1(imageID) {

  var isFavorite = !!window.dat.favorites.filter(function(fav) {
    return imageID === parseInt(fav.imageID);
  }).length;

  $('#layer2-row1').html(`
    ${countUp('x') > 3 ? '' : `
      <div class="balloon">
        タップして "お気入り" に入れると…　👉
      </div>
    `}
    <div class="fav-area" onclick="$(this).prev().hide()">
      ${new Toggle('favorites', 'imageID', isFavorite).html()}
    </div>
  `);

  $('#layer2-row1 .component-fav').on('click', function() {
    startLoading();
    if ($(this).is('.true')) {
      deleteFav(imageID).done((function(_this) {
        return function() {
          return $(_this).removeClass('true');
        };
      })(this));
    } else {
      $.post(domain + '/favorites', {
        imageID: imageID
      }).fail(function(dat) {
        return toast(dat.responseJSON.toast);
      }).done((function(_this) {
        return function() {
          return $(_this).addClass('true');
        };
      })(this));
    }
    return $.get(domain + '/images/list', {
      related: true,
      imageID: imageID
    }).done(window.renderRecommendation).always(function() {
      return stopLoading();
    });
  });
}
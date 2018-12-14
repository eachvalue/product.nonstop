import $ from 'jquery';
import {
  getUrlParameter,
  existParameter,
  loadImage
} from './_util';
import Image from '../model/Image';
import GridList from './GridList';
import PaperUser from './PaperUser';
import { renderLayer2Row1 } from './_layer2Row1';

// INFO: "imageIDが3かつuserIDが4"のような指定ができるようにするために、すべてクエリで表現。パスにはしない。
class Route {
  currentUrl = '';

  constructor() {
    $(window).on('popstate', (e)=> {
      console.log(e);
      // INFO: 進む/戻るボタンが反応していないのか戻れなくなる。その対策。URLが前と同じなら
      if(window.history.state && window.history.state.url === this.currentUrl)
        window.history.go(-1);
      // INFO: don't forget.
      this.currentUrl = window.history.state ? window.history.state.url : '';
      this.refresh();
    });
  }

  refresh() {
    const method = getUrlParameter('method') || 'images';
    const param = getUrlParameter('param') || undefined;

    $('.area-recommendation').hide();
    $('.layer-1').html('');
    $('#layer2-row1').html('');

    this[method](param);

    $('#component-actions .login')[window.dat.session ? 'hide' : 'show']();
    $('#component-actions .upload')[window.dat.session ? 'show' : 'hide']();

    $('#component-actions .users')[window.dat.session ? 'hide' : 'show']();
    $('#component-actions .mypage')[window.dat.session ? 'show' : 'hide']();
  }

  push(method, opt = {}) {
    const url = `/?method="${method}"&param=${JSON.stringify(opt)}`;
    const title = `${method} param: ${JSON.stringify(opt)}`;
    window.history.pushState({url: url, title: title}, title, url);
    // INFO: don't forget.
    // this.currentUrl = window.history.state ? window.history.state.url : '';
    return this;
  }

  users() {
    $('.layer-1').html(
    window.dat.users.reduce((prev, user)=> {
      return prev + new PaperUser().html(user);
    }, '')
    );
  }

  images(opt = {}) {
    if(opt.id) {
      renderLayer2Row1(opt.id);

      var image = window.dat.images.find(opt.id);
      $('.layer-1').html(
        `
        <div class="fluid" data-imageID="${image.id}">
          <img src="${image.url}">
        </div>`
        + GridList.html(Image.sortByRelatedEffort(opt.id))
      ).each(function() {
        GridList.run(this)
      });
    }
    else {
      $('.layer-1').html(
        GridList.html(getViewableData(opt))
      ).each(function() {
        GridList.run(this)
      });
    }
  }
}

window.Route = new Route();

function getViewableData(opt = {}) {
  if(opt.sort === 'favorites')
    return Image.sortByFavorites();
  else if(opt.filter === 'myFavorite')
    return Image.filterByMyFavorite();
  else if(opt.sort === 'newer')
    return Image.sortByNewer();
  else
    return window.dat.images;
};

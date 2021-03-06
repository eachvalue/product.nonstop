import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery.transit';
import './object/$';
import './object/Array';
import './object/FileList';
import './object/firebase';
import './component.env/Route';
import Image from './model/Image';
import {
  domain,
  getUrlParameter,
  loadImage
} from './component.env/_util';
import {
  DrawerConspicuous,
  DrawerLetsSignup,
  DrawerLetsShare
} from './component.env/drawer';
import Overlays from './component.env/_overlays';
// import GridList from './component.env/GridList';
import GridListImage from './component/GridListImage';
import BottomNavigation from './component.env/bottomNavigation';

// INFO: https://qiita.com/peutes/items/d74e5758a36478fbc039
// document.addEventListener('touchend', event => {
//   event.preventDefault();
// }, false);
disableUsersZoom();
function disableUsersZoom() {
  // for zoom with multiple fingers
  document.addEventListener('touchstart', event => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, true);

  // for zoom with double tap.
  let lastTouch = 0;
  document.addEventListener('touchend', event => {
    const now = window.performance.now();
    if (now - lastTouch <= 500) {
      event.preventDefault();
    }
    lastTouch = now;
  }, true);
}

window.$ = $;

export default class extends Component {
  constructor() {
    super();

    window.app = this;

    // INFO: .stateは使わない方針のほうが良いかもしれない
    // this.state = {
    //   images: []
    // };

    this.initializeApp();

    $(window).on('popstate', (e)=> {
      this.setState({});
    });
  }

  initializeApp() {
    $(window).on('scroll', loadImage);

    $.get(domain + '/application' + window.location.search, (dat)=> {

      // INFO: firebaseと統一しておく
      dat.images = dat.images.map((i)=> (i.created_at = new Date(i.created_at), i));

      console.log(dat);
      window.dat = dat;

      this.setState({});
      loadImage();

      window.firebase.firestore().getImages((images)=> {
        // INFO: .stateは使わない方針のほうが良いかもしれない
        // this.state.images = this.state.images.concat(images);

        // TODO: for dev
        window.dat.images = window.dat.images.concat(images);

        this.setState({});
        loadImage();
      });

      window.Route.refresh();

      $('#component-logout h1').text(window.dat.session.id);
      $('#component-logout h5').text(window.dat.session.email);
      if(window.dat.session) {
        // setInterval(()=> {
        //   new DrawerLetsShare().create();
        // }, 1000 * 60 * 1);
      }
      else {
        new DrawerConspicuous().create();
        setTimeout(()=> {
          new DrawerLetsSignup().create();
        }, 1000 * 30);
      }
    });
  }

  render() {
    let image;
    if (getUrlParameter('method') === 'images')
      image = getUrlParameter('param');

    return (
    <div className="App">
      <div className="layer-1">
        {
          image && image.id
          ?
          (
          <div className="fluid" testImageId={image.id}>
            <img src={window.dat.images.find(image.id).url} />
          </div>
          )
          :undefined
        }
        <GridListImage images={Image.sortByNewer()} />
      </div>

      <div className="component-layer layer-2">
        <div id="drawer"></div>
        <div className="frombottom">
          <div className="row" id="layer2-row1"></div>
          <div className="area-recommendation" style={{display: 'none'}}>
            <h4>関連</h4>
            <div className="component-images-horizontal"></div>
            <div className="close" onClick={(e)=> $(e.target).parent().hide(300)}>×</div>
          </div>
          <BottomNavigation setState={(v)=> {
            this.setState(v);
          }} />
        </div>
      </div>

      <Overlays />

      <div id="layer-appMessages" className="component-layer">
        <div className="loadingLine">
          <span className="expand"></span>
        </div>
        <div className="alerts"></div>
      </div>
    </div>
    );
  }
};

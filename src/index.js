import $ from 'jquery';
// import 'jquery.transit';
import './object/$';
import './object/Array';
import './old.css';
import './component.env/Route';
import _overlays from './component.env/_overlays';
import gridList from './component.env/gridList';
import bottomNavigation from './component.env/bottomNavigation';

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

$(`
<div class="layer-1">
  ${gridList}
</div>

<div class="component-layer layer-2">
  <div id="drawer"></div>
  <div class="frombottom">
    <div class="row" id="layer2-row1"></div>
    <div class="area-recommendation" style="display: none">
      <h4>関連</h4>
      <div class="component-images-horizontal"></div>
      <div class="close" onclick="$(this).parent().hide(300)">×</div>
    </div>
    ${bottomNavigation}
  </div>
</div>

<div class="component-layer">
  ${_overlays}
</div>

<div id="layer-appMessages" class="component-layer">
  <div class="loadingLine">
    <span class="expand"></span>
  </div>
  <div class="alerts"></div>
</div>

<script>
  initializeApp()
</script>
`).appendTo('body');

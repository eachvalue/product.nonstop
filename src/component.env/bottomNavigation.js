import $ from 'jquery';
import './bottomNavigation.css';
export default `
<div class="bottomNavigation">
	<div id="component-actions">
		<span 
			onclick="Route.push('images', { sort: 'favorites' }).refresh()"
			class="most fas fa-award"
			>
			人気順
		</span>
		<span 
			onclick="Route.push('images', { sort: 'newer' }).refresh()"
			class="newPosts far fa-images"
			>
			新着順
		</span>
		<span 
			onclick="Route.push('images', { filter: 'myFavorite' }).refresh()"
			class="favorite fas fa-heart"
			>
			お気入り一覧
		</span>
		<span
			onclick="$('#component-logout').show(300)"
			class="mypage fas fa-user-circle"
			>
			マイページ
		</span>
		<button class="login poyooon" onclick="$('#component-login').show(300)">ログイン</button>
	</div>
</div>
`;

window.bottomNavigation = {};
window.bottomNavigation.scroll = ()=> {
	const w = $('#component-actions > *').reduce(function(w, el) {
		return w + $(el).outerWidth(true);
	}, 0);
	$('#component-actions').animate({ 
		scrollLeft: w - $('#component-actions').outerWidth()
	}, 800);
};

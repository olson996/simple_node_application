'use strict';

const submitHex = function(id){
	const xhrPost = new XMLHttpRequest();
	xhrPost.open('POST', '/selection');
	xhrPost.setRequestHeader('Content-Type', 'application/json');
	xhrPost.addEventListener('load', function(){
		const color = JSON.parse(xhrPost.response);
		console.log('loaded color palette.. ');
		console.log(color);
		manipulateColor(color.colors);

	});

	xhrPost.addEventListener('error', function(){
		console.error('error happened');
	});
	xhrPost.timeout = 3*1000;
	xhrPost.addEventListener('timeout', function() {
		console.warn('Timeout');
	});
	xhrPost.send(
		JSON.stringify({
			color: id
		})
	);
};

let manipulateColor = function(colors){
	const parentDiv = document.querySelector('#color-body');
	if(document.querySelector('.paletteList')){
		parentDiv.removeChild(document.querySelector('.paletteList'));
	}
	const ul = document.createElement('ul');
	ul.className = 'paletteList';
	colors.forEach(function(color){
		const li = document.createElement('li');
		li.setAttribute('style', `background-color: #${color}`);
		li.className = 'palettItem';
		ul.appendChild(li);
	});
	parentDiv.appendChild(ul);
};

document.querySelector('#hex-form').addEventListener('submit', function(evt){
	evt.preventDefault();
	const input = document.querySelector('#hex'),
		id = input.value;
	input.value = '';
	submitHex(id);
});
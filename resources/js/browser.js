'use strict';
let x = document.querySelectorAll('.block');

x.forEach(function(i){
	let t = i.getAttribute('style');
	let y = document.createTextNode(`#${t[19] + t[20] + t[21] + t[22] + t[23] + t[24]}`);
	i.parentNode.appendChild(y);
});


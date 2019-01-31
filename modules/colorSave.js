'use strict';
let obj={};
const colors = [];
obj.addColor = function(color){
	colors.pop();
	colors.push(color);
};
obj.getColor = function(){

	return colors;
};

module.exports = obj;
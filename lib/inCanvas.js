/**
 * Created by andreiGladkov on 18.07.15.
 */
;
function InCanvas(canvas){
	"use strict"

	if(!(canvas.tagName && canvas.tagName === 'CANVAS')){
		throw new Error('Element ' + canvas + ' is not passed to the constructor canvas ');
	}

	var pixelCount = canvas.width * canvas.height,
		filters = {},
		ctx = canvas.getContext('2d');

	/**
	 * Public method
	 * @returns {*} - elem canvas
	 */
	this.getCanvas = function(){
		return canvas;
	};

	/**
	 * Private methods
	 * filter canvast to white-black colors
	 * @returns {HTMLElement} - canvas after applying the filter
	 */
	filters['white-black'] = function(){
		var red, green, blue, gray,
			shadowCanvas = document.createElement('canvas'),
			shadowCtx = shadowCanvas.getContext('2d'),
			arrImgColor = ctx.getImageData(0,0, canvas.width, canvas.height);

		shadowCanvas.width = canvas.width;
		shadowCanvas.height = canvas.height;

		for(var i = 0; i < pixelCount*4; i +=4){
			red = arrImgColor.data[i];
			green = arrImgColor.data[i + 1];
			blue = arrImgColor.data[i + 2];
			gray = Math.floor((red + green + blue)/3);
			arrImgColor.data[i] = gray;
			arrImgColor.data[i + 1] = gray;
			arrImgColor.data[i + 2] = gray;
		}

		shadowCtx.putImageData(arrImgColor,0,0);

		return shadowCanvas;
	};

	/**
	 * Public methods
	 * filter canvas
	 * @param filter - filter name
	 * @returns {*}
	 */
	this.filter = function(filter){
		if(filters[filter]){
			return filters[filter]();
		}else{
			throw new Error('Filter: ' + filter + ' is not defined!');
		}
	};
};
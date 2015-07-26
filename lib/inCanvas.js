/**
 * Created by andreiGladkov on 18.07.15.
 */
;
function InCanvas(canvas){
	"use strict"

	var pixelCount = canvas.width * canvas.height,
		ctx = canvas.getContext('2d');

	/**
	 *
	 * @returns {*} - elem canvas
	 */
	this.getCanvas = function(){
		return canvas;
	};

	this.filterGray = function(){
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
	}

};
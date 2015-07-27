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
	 * init filter properties
	 * @private
	 */
	filters._init = function(){
		this._shadowCanvas = document.createElement('canvas'),
		this._shadowCtx = this._shadowCanvas.getContext('2d'),
		this._arrImgColor = ctx.getImageData(0,0, canvas.width, canvas.height);

		this._shadowCanvas.width = canvas.width;
		this._shadowCanvas.height = canvas.height;
	};

	/**
	 * Private methods
	 * filter canvas to white-black colors
	 * @returns {HTMLElement} - canvas after applying the filter
	 */
	filters['white-black'] = function(){
		filters._init.apply(this);

		for(var i = 0; i < pixelCount*4; i +=4){
			this._red = this._arrImgColor.data[i];
			this._green = this._arrImgColor.data[i + 1];
			this._blue = this._arrImgColor.data[i + 2];
			this._gray = Math.floor((this._red + this._green + this._blue)/3);
			this._arrImgColor.data[i] = this._gray;
			this._arrImgColor.data[i + 1] = this._gray;
			this._arrImgColor.data[i + 2] = this._gray;
		}

		this._shadowCtx.putImageData(this._arrImgColor,0,0);

		return this._shadowCanvas;
	};

	/**
	 * Private methods
	 * filter canvas to septia effect
	 * @returns {HTMLElement} - canvas after applying the filter
	 */
	filters['septia'] = function(){
		filters._init.apply(this);

		for(var i = 0; i < pixelCount*4; i +=4){
			this._red = this._arrImgColor.data[i];
			this._green = this._arrImgColor.data[i + 1];
			this._blue = this._arrImgColor.data[i + 2];
			this._arrImgColor.data[i] = Math.floor(this._red*0.393) + Math.floor(this._green*0.769) + Math.floor(this._blue*0.189);
			this._arrImgColor.data[i + 1] = Math.floor(this._red*0.349) + Math.floor(this._green*0.686) + Math.floor(this._blue*0.168);
			this._arrImgColor.data[i + 2] = Math.floor(this._red*0.272) + Math.floor(this._green*0.534) + Math.floor(this._blue*0.131);
			this._arrImgColor.data[i + 3] = 255;
		}

		this._shadowCtx.putImageData(this._arrImgColor,0,0);

		return this._shadowCanvas;
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
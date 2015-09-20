/**
 * Created by andreiGladkov on 18.07.15.
 */
;
function InCanvas(canvas){
	"use strict"

	if(!(canvas.tagName && canvas.tagName === 'CANVAS')){
		throw new Error('Element ' + canvas + ' is not passed to the constructor canvas ');
	}

	var filters = this.filters,
		RGBA_LENGTH = 4,
		pixelCount = RGBA_LENGTH*canvas.width * canvas.height,
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

		for(var i = 0; i < pixelCount; i += RGBA_LENGTH){
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

		for(var i = 0; i < pixelCount; i += RGBA_LENGTH){
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
	 *  Private methods
	 * filter canvas to blur 8 bit effect
	 * @returns {*}
	 */
	filters['blur-8bit'] = function(){
		filters._init.apply(this);

		//TODO проверить пограничные состояния!

		var arrGays = [0.5, 0.75, 0.5, 0.75, 1.0, 0.75, 0.5, 0.75, 0.5];
		var gridValue = 3,
			gridValueCounter = 0,
			gridLength = Math.pow(gridValue,2),
			pixelNextGrid = 0,
			pixelNextGridCopy = pixelNextGrid,
			gridValueCounterCopy = gridValueCounter,
			pixelGridLength = RGBA_LENGTH*gridLength;

		for(var i = 0; i < pixelCount; i += pixelGridLength){
			var k = 0, n = 0, red = [], green = [], blue = [], alpha =[];

			for(var j = 0; j < gridLength; j++){

				if(j%gridValue == 0){
					gridValueCounter += gridValue;
					pixelNextGrid += RGBA_LENGTH*this._shadowCanvas.width;
					//при переходе на новую строку в матрице нужно убрать текущее значение сетки
					pixelNextGrid -= j;
				}

				if(j >= gridValueCounter){
					red.push(this._arrImgColor.data[i + j + pixelNextGrid + n]);
					n++;
					green.push(this._arrImgColor.data[i + j + pixelNextGrid + n]);
					n++;
					blue.push(this._arrImgColor.data[i + j + pixelNextGrid + n]);
					n++;
					alpha.push(this._arrImgColor.data[i + j + pixelNextGrid + n]);
				}else {
					red.push(this._arrImgColor.data[i + j + n]);
					n++;
					green.push(this._arrImgColor.data[i + j + n]);
					n++;
					blue.push(this._arrImgColor.data[i + j + n]);
					n++;
					alpha.push(this._arrImgColor.data[i + j + n]);
				}
			}

			var newRed=0,newGreen=0,newBlue=0,newAlpha=0;

			red.forEach(function(item){
				newRed += item;
			});

			green.forEach(function(item){
				newGreen += item;
			});

			blue.forEach(function(item){
				newBlue += item;
			});

			alpha.forEach(function(item){
				newAlpha += item;
			});


			for(var j = 0; j < gridLength; j++){
				if(j%gridValue == 0){
					gridValueCounterCopy += gridValue;
					pixelNextGridCopy += RGBA_LENGTH*this._shadowCanvas.width;
					pixelNextGridCopy -= j;
				}

				if(j >= gridValueCounterCopy){
					this._arrImgColor.data[i + j + pixelNextGridCopy + k] = newRed/gridLength;
					k++;
					this._arrImgColor.data[i + j + pixelNextGridCopy  + k] = newGreen/gridLength;
					k++;
					this._arrImgColor.data[i + j + pixelNextGridCopy + k] = newBlue/gridLength;
					k++;
					this._arrImgColor.data[i + j + pixelNextGridCopy + k] = newAlpha/gridLength;
				}else {
					this._arrImgColor.data[i + j + k] = newRed/gridLength;
					k++;
					this._arrImgColor.data[i + j + k] = newGreen/gridLength;
					k++;
					this._arrImgColor.data[i + j + k] = newBlue/gridLength;
					k++;
					this._arrImgColor.data[i + j + k] = newAlpha/gridLength;
				}

			}
		}

		this._shadowCtx.putImageData(this._arrImgColor,0,0);

		return this._shadowCanvas;
	};
}

/**
 * Public methods
 * filter canvas
 * @param filter - filter name
 * @returns {*}
 */
InCanvas.prototype.filter = function(filter){
	if (this.filters[filter]) {
		return this.filters[filter]();
	} else {
		throw new Error('Filter: ' + filter + ' is not defined!');
	}
};
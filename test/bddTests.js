/**
 * Created by andreiGladkov on 21.07.15.
 */

var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	entityCanvas = new InCanvas(canvas),
	grayCanvas,
	nodeSectionBaseCanvas = document.getElementById('base-canvas'),
	nodeSectionEditCanvas = document.getElementById('edit-canvas'),
	nodeSectionEditSeptiaCanvas = document.getElementById('edit-canvas-septia'),
	nodeSectionEditBlurCanvas = document.getElementById('edit-canvas-blur'),
	pixelCount = canvas.width*canvas.height,
	img = new Image();

img.src = '/inCanvas/test/img/img.jpg';

img.onload = function(){
	canvas.width = this.naturalWidth;
	canvas.height = this.naturalHeight;
	ctx.drawImage(img, 0, 0);
	entityCanvas = new InCanvas(canvas); // Перезапишем сущность после загрузки изображения
	grayCanvas = entityCanvas.filter('white-black');
	nodeSectionBaseCanvas.appendChild(entityCanvas.getCanvas());
	nodeSectionEditCanvas.appendChild(grayCanvas);
	nodeSectionEditSeptiaCanvas.appendChild(entityCanvas.filter('septia'));
	nodeSectionEditBlurCanvas.appendChild(entityCanvas.filter('blur-8bit'));
};


function checkGrayFilter(checkCanvas, baseCanvas){
	var ctx = baseCanvas.getContext('2d'),
		arrImgColor = ctx.getImageData(0,0, baseCanvas.width, baseCanvas.height),
		ctxGrayImg  = checkCanvas.getContext('2d'),
		arrGrayColor = ctxGrayImg.getImageData(0,0, checkCanvas.width, checkCanvas.height);

	for(var i = 0; i < pixelCount*4; i +=4){
		red = arrImgColor.data[i];
		green = arrImgColor.data[i + 1];
		blue = arrImgColor.data[i + 2];
		gray = Math.floor((red + green + blue)/3);

		if( arrGrayColor.data[i] != gray &&
			arrGrayColor.data[i + 1] != gray &&
			arrGrayColor.data[i + 2] != gray
		){
			return false;
		}
	}

	return true;

}

describe("inCanvas init", function(){

	it('Геттер элемента canvas, возвращает исходный канвас' , function(){
		assert.equal(entityCanvas.getCanvas(), canvas);
	});

	it('Черно белый фильтр, преобразует цветное изображение в черно-белое', function(){
		assert.equal(checkGrayFilter(grayCanvas, canvas), true);
	});

	it('Черно белый фильтр, преобразует цветное изображение в черно-белое (проверяймый канвас не чернобелый)', function(){
		var defaultCanvas = document.createElement('canvas');
		assert.equal(checkGrayFilter(defaultCanvas, canvas), false);
	});
});
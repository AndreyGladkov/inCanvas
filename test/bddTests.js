/**
 * Created by andreiGladkov on 21.07.15.
 */

var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	entityCanvas = new InCanvas(canvas),
	nodeSectionBaseCanvas = document.getElementById('base-canvas'),
	nodeSectionEditCanvas = document.getElementById('edit-canvas'),
	img = new Image();

img.src = '/inCanvas/test/img/img.jpg';

img.onload = function(){

	canvas.width = this.naturalWidth;
	canvas.height = this.naturalHeight;
	ctx.drawImage(img, 0, 0);
	entityCanvas = new InCanvas(canvas); // Перезапишем сущность после загрузки изображения
	nodeSectionBaseCanvas.appendChild(entityCanvas.getCanvas());
	nodeSectionEditCanvas.appendChild(entityCanvas.filter('white-black'));
};

describe("inCanvas init", function(){

	it('Геттер элемента canvas, возвращает исходный канвас' , function(){
		assert.equal(entityCanvas.getCanvas(), canvas);
	});

});
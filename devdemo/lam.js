import Brahma from './lib/Brahma';
import Anomaly from './lib/Anomaly';
import './lib/brahmaCartoon';
import { tm, svgPathToCubicBezierPoints } from './lib/tm';

Brahma(function(B) {
	var dollhouse = B.app('dollhouse', {
		htmlElements: {},
		pattern: {},
		config: {
			patterns: {}
		}
	});

	dollhouse.run = function() {
		// Set HTML Elements
		this.htmlElements.floors = B(this.selector).find('.floors').first();

		// Build floors
		this.module('floors');

		//this.module('floors').bind('')
	};

	/* Функция возвращает ссылку на объект этажа по элементу, который находится внутри этого этажа */
	dollhouse.getFloorByNode = function(node) {
		for (var i in this.module('floors').list) {
			if (this.module('floors').list.hasOwnProperty(i)) {
				if (this.module('floors').list[i].node===node) return this.module('floors').list[i];
			}
		}
		return false;
	}

	;(function() {
	dollhouse.module('floors', function() {

		var that = this,id=0,currentScrollTop,currentScrollBottom,loadings=0,floorLoaded=function() {
			loadings--;

			if (loadings===0) {

				/* Отслеживаем видимость этажей */
				Brahma(window).bind('scroll', function() {
					currentScrollTop = Brahma(window).scroll().top;
					// Проверяем какие этажи в области видимости
					currentScrollBottom = currentScrollTop+Brahma(window).height();
					for (var i in that.list) {
						if (that.list.hasOwnProperty(i)) {
							if (
								that.list[i].offsetTop<(currentScrollBottom-(that.list[i].sourceHeight/2) )
								&&
								(that.list[i].offsetTop+that.list[i].sourceHeight) > currentScrollTop
							) {
								if (!that.list[i].seen) {

									that.list[i].seen = true;
									that.list[i].trigger("seen")
								}
							} else {
								if (that.list[i].seen) {
									that.list[i].trigger("lost")
									that.list[i].seen = false;
								}
							}
						}
					}
				});
			}
		};
		/* Каждый непосредственный дочерний нод - это этаж. */
		B(this.master.htmlElements.floors).find('>*').each(function() {
			that.list.push(Brahma.module({
				"id": id,
				"node": this,
				"width": B(this).data('width'),
				"max-width": B(this).data('max-width'), // elem(DOM).data('max-width');
				"height": B(this).data('height'),
				"sourceHeight": false,
				"sourceWidth": false,
				"offsetTop": null,
				"seen": false
			}));
			id++;
		});
		/* Выстраиваем каждый этаж */
		loadings++;
		for (var i = 0;i<this.list.length;i++) {
			loadings++;
			this._buildFloor(this.list[i], floorLoaded);
		}
		floorLoaded();
	},{
		list: [], /* Список всех этажей, выстроенных согласно их индексу */
		visible: function() {
			return this.list;
		},
		/* Построение этажа, установка высоты и ширины */
		_buildFloor: function(floorObject, callback) {

			/*
			Оцениваем знаение высоты, если оно указано в относительных еденицах
			*/
			if (floorObject.height.substr(-3)==='rat') {
				/* Рассчитываем процентное соотношение к ширине */
				//abstract.convert.pixalize();
				var ratio = (parseFloat(floorObject.height.substr(0,floorObject.height.length-3))*100).toFixed(2);
				floorObject.sourceHeight = parseInt(floorObject['max-width'])*parseFloat(floorObject.height.substr(0,floorObject.height.length-3));

			} else {
				ratio=false;
				floorObject.sourceHeight = parseInt(floorObject.height);
			}


			floorObject.sourceWidth = parseInt(floorObject['max-width']);

			if (ratio) {
				/*
				Если высота указана в ration, то мы должны создать специальный трюк для создания блока с относительной высотой.
				Для самого этажа мы применяем специальный стиль ratioBlock */
				var wrap = B(floorObject.node).addClass('ratioBlock').find('>*').wrapAll('div').wrapAll('div').css({
					'padding-bottom': ratio+'%'
				});
			}

			Brahma(floorObject.node).attr("source-height", floorObject.sourceHeight);

			B(floorObject.node).css({

				'height': ratio ? 'auto' : parseInt(floorObject.height)+'px'
			})
			.attr({
				"data-floor-id": floorObject.id
			});
			// Устанавливаем offsetTop
			floorObject.offsetTop = B(floorObject.node)[0].offsetTop;

			// Инициализируем каждый объект
			var that = this,objectsLoadings=1,objectLoaded = function() {
				objectsLoadings--;
				if (objectsLoadings===0) {
					callback();
				}
			};
			B(floorObject.node).find('[data-object]').each(function() {
				that.master.module('objects').init(floorObject, this, objectLoaded);
			});
			objectLoaded();

		}
	});
})();
	;(function(dollhouse) {
	// Преобразуем ширину каждого объекта в относительное значение
	var patchObjectWidth = function(imgWidth) {

		Brahma(this.node).addClass('image-object').css("width", ((imgWidth/parseInt(this.floor['max-width']))*100).toFixed(2)+'%' )
	};
	// Object Prototype
	var objectPrototype = function(master,uid,node,floor,onready) {
		this.master = master;
		this.floor = floor;
		this.node=node;
		this.config = B.extend(B.parseCssDeclarations(B(node).data("object")||""));

		// Вычисляем z-index
		/* Нулевой zindex в реальности является 1000, таким образом мы выделяем 1000 пикселей на ось z на плюсовые значения */
		this.z = this.config.z||0;

		// Объекты, содержащие внутри изображения должны получить их размеры и установки пропорционального значения относительно
		// установленных исходных размеров родительского этажа max-width
		var that = this;

		;(function(i) {
			if (i===undefined) { Brahma(that.node).addClass('released'); return; }
			// Создаем копию изображения
			var img = new Image();

			img.src = i.src;

			if (img.width>0) {

				patchObjectWidth.call(that, img.width);

				Brahma.frame(function() {
					Brahma(that.node).addClass('released');

					onready();
				});
			} else {
				img.onload = function() {
					onready();

					patchObjectWidth.call(that, img.width);

					Brahma(that.node).addClass('released');
				}
			}

		})(Brahma(this.node).find('>img')[0]);

		this.release();

		/* Расширяем через шаблон */
		if (this.config.pattern) {
			this.master.master.module('patterns').module(this.config.pattern).handle(this);
		}
	};
	objectPrototype.prototype = Brahma.module({
		config: {
			top: 0,
			left: 0
		},
		release: function() {
			var css = {};
			/*
			Все значения переданные в пикселях необходимо преобразовать в проценты
			*/
			if (this.config.top) css.top = Brahma.percentify(this.config.top, this.floor.sourceHeight)+'%';
			if (this.config.left) css.left = Brahma.percentify(this.config.left, this.floor.sourceWidth)+'%';
			if (this.config.right) css.right = Brahma.percentify(this.config.right, this.floor.sourceWidth)+'%';
			if (this.config.bottom) css.bottom = Brahma.percentify(this.config.bottom, this.floor.sourceHeight)+'%';

			if (this.config.width) css.width = Brahma.percentify(this.config.width, this.floor.sourceWidth)+'%';
			if (this.config.height) css.height = Brahma.percentify(this.config.height, this.floor.sourceHeight)+'%';
			css['z-index'] = 1000+parseInt(this.z);

			B(this.node).css(css)
		}
	});
	objectPrototype.prototype.constructor = objectPrototype;

	dollhouse.module('objects', function() {

	}, {
		list: {},
		counter: 0,
		init: function(floor, node, onready) {
			var uid = "object-"+this.counter;this.counter++;
			this.list[uid] = new objectPrototype(this,uid,node,floor,onready);
		}
	});
})(dollhouse);
	dollhouse.module('patterns', function() {
		;(function() {

	this.module('cloud', function() {
		var that = this;
		var getwwidth = function() {
			var db = document.getElementsByTagName('body')[0];
			that.ww = window.innerWidth || document.documentElement.clientWidth || db.clientWidth;
			that.wh = window.innerHeight || document.documentElement.clientHeight || db.clientHeight;
		};

		// Слушаем перепещения мыши по документу и изменение размеров окна
		Brahma.document.translateEvents(this, 'body.mousemove');
		Brahma.document.translateEvents(this, 'window.resize');

		getwwidth();
		this.bind('window.resize', function(e) {
			getwwidth();
		});

		var that = this;
		this.bind('body.mousemove', function(e) {
			Brahma.frame(function() {
				that.calc(e);
			});
		});

	}, {
		ww: 0,
		wh: 0,
		dx: 0,
		dy: 0,
		$A: 0,
		matrixs: 200,
		focusd: 100,
		calc: function(e) {
			//
			this.dx = (e.clientX-(this.ww/2))/(this.ww/2)*-1,
			this.dy = (e.clientY-(this.wh/2))/(this.wh/2)*-1;
			//

			/* Ищем угол $A по двум сторонам и углу 90 (решение равнобедренного) */
			this.$A = (function(a, b, $C) {
				var c = Math.sqrt(
					Math.pow(a,2) + Math.pow(b, 2) - (2 * a * b * tm.cos($C))
				);

				// Находим угол А
				return tm.ra_de(Math.acos((b*b + c*c - a*a)/(2*b*c)));
			})(
				this.matrixs/2,
				this.focusd,
				90
			);

			this.trigger('mousemove');
		},
		handle: function(ob) {
			// -ww-that.z
			this.bind('mousemove', function() {
				// Ищем сторону с по стороне и двум углам
				var areaw = (function(a, $B, $C) {
					var $A=180-($B+$C);
					return (a*tm.sin($C))/tm.sin($A)
				})(ob.z*-1, 90, this.$A);

				// Рассчет перспективы
				var shiftx = (areaw*2)*this.dx;

				Brahma(ob.node).css(['-webkit-','-ms-'], {
					'transform': 'translateX('+(this.dx*areaw/10)+'px) translateY('+(this.dy*areaw/20)+'px)'
				});
			});
		}
	});
}).call(this);

		;(function() {
	var cubicbpath = ["1%","50%","1%","22.75%","10%","1%","19%","1%","19%","1%","25%","1%","41.5%","32%","50%","50%","50%","50%","58%","66.5%","67.5%","99%","80%","99%","80%","99%","93%","99%","99%","72.5%","99%","50%","99%","50%","99%","30%","91%","1%","81%","1%","81%","1%","67.5%","1%","57%","30.5%","50%","50%","50%","50%","42.5%","67.5%","32%","99%","20%","99%","20%","99%","8%","99%","1%","81%","1%","50%"];

	var boxsize = [500,180];
	var frames = 300;
	var i = 0;
	var progress = 0;
	var stack = 0;
	var getangles = function(a,b) {
		var c = Math.sqrt(Math.pow(a,2) + Math.pow(b, 2) - (2 * a * b * tm.cos(90)));
		var $A = tm.ra_de(Math.acos((b*b + c*c - a*a)/(2*b*c)));
		var $B = 180-(90+$A);
		return [$A,$B];
	};
	/*
	Расчет местоположения точки в пространстве по кривой Безье в прогрессе t
	*/
	var getbezierxy = function(t, P0x,P0y,P1x,P1y,P2x,P2y,P3x,P3y) {
		return [
			(Math.pow((1 - t), 3) * P0x) +
						(3 * Math.pow((1 - t), 2) * t * P1x) +
						(3* (1 - t) * Math.pow(t, 2) * P2x) +
						(Math.pow(t, 3) * P3x),
			(Math.pow((1 - t), 3) * P0y) +
						(3 * Math.pow((1 - t), 2) * t * P1y) +
						(3* (1 - t) * Math.pow(t, 2) * P2y) +
						(Math.pow(t, 3) * P3y)
		];
	};
	/*
	Расчет направления движения между двумя координатами
	*/
	var getangledirection = function(x0,x,y0,y) {
		var angle=0, a, b;
		if (y0===y) {
			if (x>x0) angle = 0;
			else if (x<x0) angle = 180;
			else if (x===x0) angle = 0;
		} else if (x0===x) {
			if (y>y0) angle = 90;
			else if (y0>y) angle = -90;
			else angle = 0;
		}
		else {

			if (y0>y && x>x0) {
				a = x - x0;
				b = y - y0;
				angle = getangles(a,b)[1];

			} else if (x>x0 && y>y0) {
				a = y - y0;
				b = x - x0;
				angle = getangles(a,b)[0];

			} else if (x0>x && y>y0) {
				a = x - x0;
				b = y - y0;
				angle = 90+getangles(a,b)[0];

			} else if (y0>y && x0>x) {
				a = x - x0;
				b = y - y0;
				angle = 180-getangles(a,b)[1];
			};
		}
		return angle;
	}
	this.module('bird', function() {
		var that = this;

		i=0;
		// Запускаем временую шкалу
		Anomaly.stream({
			duration: 7000
		}).frame(function(em,progress) {
			that.trigger('frame', [progress])
		});
	}, {
		handle: function(ob) {
			// Формируем кастомный путь, если такой есть
			if (ob.config.path) {
				var path = ob.config.path ? svgPathToCubicBezierPoints(ob.config.path, true) : cubicbpath;
			}

			var x0=0,y0=0,cubicbpathpx = [],xy=0,x,y,rotatemode,
			area=[
				ob.config['area-width']||boxsize[0],
				ob.config['area-height']||boxsize[1]
			],staksCount=0,stack,t;

			// Устанавливаем опцию rotate
			rotatemode = ob.config.rotate?(ob.config.rotate==='none'?false:ob.config.rotate):true;

			// Конвертируем процентры в пиксели
			for (i = 0;i<path.length;i++) {
				cubicbpathpx[i] = Brahma.pixelize(path[i], area[xy]);
				xy=xy===0?1:0;
			}
			staksCount=cubicbpathpx.length/8;
			this.bind('frame', function(progress) {
				/*
				Расчитываем какой стек из 8 точек сейчас работает
				*/

				stack = Math.floor(progress/(1/staksCount) );
				t = (progress - (stack*(1/staksCount))) / (1/staksCount) ;


				xy = getbezierxy(t,
					cubicbpathpx[stack*8],
					cubicbpathpx[(stack*8)+1],
					cubicbpathpx[(stack*8)+2],
					cubicbpathpx[(stack*8)+3],
					cubicbpathpx[(stack*8)+4],
					cubicbpathpx[(stack*8)+5],
					cubicbpathpx[(stack*8)+6],
					cubicbpathpx[(stack*8)+7]
				);
				x = xy[0]; y = xy[1];
				var a=0,b=0,summand=0,angle=0;
				if (rotatemode) {
					// Рассчет направления движения
					angle = getangledirection(x0,x,y0,y);
				} else {
					angle = 0;
				}

				x0=x;y0=y;
				Brahma(ob.node).css(['-webkit-','-ms-'], {
					"transform": "translateX("+x+"px) translateY("+y+"px) rotateZ("+(angle)+"deg)"
				});
			});
		}
	});
}).call(this);
	});

});

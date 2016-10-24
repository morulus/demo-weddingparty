const Anomaly = (function() {

		/*
	Extend
	*/

	var extend = (function() {
		var hasOwn = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;

		var isArray = function isArray(arr) {
			if (typeof Array.isArray === 'function') {
				return Array.isArray(arr);
			}

			return toStr.call(arr) === '[object Array]';
		};

		var isPlainObject = function isPlainObject(obj) {
			'use strict';
			if (!obj || toStr.call(obj) !== '[object Object]') {
				return false;
			}

			var has_own_constructor = hasOwn.call(obj, 'constructor');
			var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
			// Not own constructor property must be Object
			if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			var key;
			for (key in obj) {}

			return key === undefined || hasOwn.call(obj, key);
		};

		return function() {
			'use strict';
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0],
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if (typeof target === 'boolean') {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
				target = {};
			}

			for (; i < length; ++i) {
				options = arguments[i];
				// Only deal with non-null/undefined values
				if (options != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};
	})();
	/*
	Обеспечивает работу события для объекта.
	*/
	var InternalEvents = {
		eventListners : {},
		bind : function(e, callback, once) {
			if (typeof this.eventListners[e] != 'object') this.eventListners[e] = [];
			
			this.eventListners[e].push({
				callback: callback,
				once: once
			});

			return this;
		},
		on: function() {
			this.bind.apply(this, arguments);
			return this;
		},	
		once : function(e, callback) {
			this.bind(e, callback, true);
			return this;
		},
		trigger : function() {
			
			
			if (typeof arguments[0] == 'integer') {
				var uin = arguments[0];
				var e = arguments[1];
				var args = (arguments.length>2) ? arguments[2] : [];
			} else {
				var uin = false;
				var e = arguments[0];
				var args = (arguments.length>1) ? arguments[1] : [];
			};
			
			var response = false;

			if (typeof this.eventListners[e] == 'object' && this.eventListners[e].length>0) {
				var todelete = [];
				for (var i = 0; i<this.eventListners[e].length; i++) {
					if (typeof this.eventListners[e][i] === 'object') {
						if (typeof this.eventListners[e][i].callback === "function") response = this.eventListners[e][i].callback.apply(this, args);
						
						if (this.eventListners[e][i].once) {

							todelete.push(i);
						};
					};
				};
				
				if (todelete.length>0) for (var i in todelete) {
					this.eventListners[e].splice(todelete[i], 1);
				};
			};
			return response;
		}
	};

	var Anomaly = function() {};
	Anomaly.prototype = {
		constructor: Anomaly
	};
	/**
	easings
	*/
	Anomaly.prototype.easing = {
	// t: current time, b: begInnIng value, c: change In value, d: duration
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - this.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return this.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return this.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};
	/**
	stream subprogramm
	Запускает поток фреймов
	Anomaly.stream()

	
	@option int maxFps — максимальное значение fps
	@option int moxChoke — максимальное значение choke, после которого кадры будут игнорироваться
	@option bool stackLength — размер стека в мс
	@option bool infinityStacks — бесконечный поток фреймов

	Example:
	var stream = Anomaly.stream();
	stream.frame(function(elapsed) {
	
	});
	*/
		
	var Stream = function(config) {
		this.config = {
			/*
			Количество кадров в секунду выставляется автоматически, в зависимости от пропускной способности браузера.
			Но количество кадров в секунду не будет привышать знаения maxFps
			*/
			maxFps: 200,
			/*
			Максимальное количество едениц потока, которые входят в однин фрейм. По умолчанию это значение ровняется 1.
			Это значит, что в один фрейм может вместиться лишь одна еденица потока. Это равносильно использованию 
			requestAnimationFrame.
			Если же количество choke едениц будет установлено больше одного, тогда в пределах одного фрейма может 
			присутствовать несколько едениц потока. Это может быть полезно при отрисовки графики, когда не зависимо
			от fps необходимо отрисовать каждый требуемый фрагмент рисунка.
			*/
			maxChoke: 1,
			/*
			duration определяет величину в миллисекундах, которая будет считаться 100% прогрессом. Каждое событие
			frame содержит в себе информацию о времени с начала запуска потока и текущем прогрессе. Т.е. по 
			прошествии 500ms при величине duration 1000ms прогресс будет составлять 50%.
			*/
			duration: 1000,
			/*
			infinity указывает прекращать ли поток по достижении 100% прогресса потока, или же сбрасывать прогресс
			до 0% при каждом его достижении.
			*/
			infinity: true
		};
		this.data = {
			/*
			Текущее значение fps. Оно начинается с 200 и корректируется автоматически.
			*/
			fps: 60,
			/*
			Текущее значение прогресса
			*/
			progress: 0,
			/*
			Время начала потока
			*/
			streamStartTime: 0,
			/*
			Время начала стэка
			*/
			stackStartTime: 0,
			/*
			Время начала кадра
			*/
			frameStartTime: 0
		};
		/*
		Отчет о текущих величинах потока
		*/
		this.stats = {
			/*
			Количество кадров, которые были активированы не в своё время. Т.е. это фактически задержанные кадры.
			*/
			choke: 0,
			/*
			Количество потерянных кадров
			*/
			lose: 0
		};
		/*
		Определяет активен ли поток. При запуске потока становтся в значение true. Потом будет прекращен без вызова _end,
		при мануальной мнене на false.
		*/
		this._running = false;
		/*
		Импорт пользовательских настроек
		*/
		if ("object"===typeof config) for (var i in config) if (config.hasOwnProperty(i)) this.config[i] = config[i];
	};

	/*
	Расширяем прототип для формирования API
	*/
	Stream.prototype = extend({
		constructor: Stream
	}, InternalEvents);

	/*
	Полифил для requestAnimationFrame & метод requestFrame
	*/
	(function() {
		var vendors = ['ms', 'moz', 'webkit', 'o'],customRequestAnimationFrame=window.requestAnimationFrame,customCancelAnimationFrame=window.cancelAnimationFrame;
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		   customRequestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		   customCancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
		Stream.prototype.requestFrame = function(callback) {
			requestAnimationFrame(callback);
		};
	})();

	/*
	Запуск потока
	*/
	Stream.prototype.start = function() {
		var that = this, 
		i,
		frameDuration, // < Логическая продолжительность фрейма
		slowdown, // < Функция понижения fps
		rateup, // < Функция повышения fps
		frame, // < Функция обработчик фрейма
		stackElapsedTime, // < Продолжительность потока
		streamElapsedTime,  // < Продолжительность стека
		frameElapsedTime, // < Продолжительность натурального фрейма
		virtualFramesCount, // < Количество виртуальных фреймов в натуральном
		residue; // < Виртуальный кусок фрейма
		/*
		Начинаем отсчет времени с момента начала потока
		*/
		this._fireStreamTimeCounting();
		/*
		Начинаем отсчет времени с момента начала стека
		*/
		this._fireStackTimeCounting();
		/*
		Начинаем отсчет времени с момента начала фрейма
		*/
		this._fireFrameTimeCounting();
		/*
		Рассчитывает продолжительность одного фрейма исходя из текущего значения fps.
		*/
		frameDuration = 1000/this.data.fps;
		/*
		Инициализируем slowdown функцию для текущего потока. Она понимает fps, стараясь свести choke к 0.
		Каждый новый кадр fps будет пониматься на 1% пока значение choke не будет ровняться 0. Эта
		функция вызывается автоматически при повышенном значении choke.
		*/
		slowdown = function() {
			/*
			Уменьшаем fps на 1%
			*/
			that.data.fps*=0.99;
			/*
			Производим перерасчет продолжительности кадра
			*/
			frameDuration = 1000/that.data.fps;
		};
		/*
		Инициализация rateup функции для текущего потока, которая повышает fps, если это позволяет
		производительности.
		*/
		rateup = function() {
			/*
			Повышаем fps на 1%
			*/
			that.data.fps*=1.01;
			/*
			Проверяем не привышение максимально допустимого fps
			*/
			if (that.data.fps>that.config.maxFps) that.data.fps = that.config.maxFps;
			/*
			Производим перерасчет продолжительности кадра
			*/
			frameDuration = 1000/that.data.fps;
		};
		/*
		Обработчик фрейма.
		*/
		frame = function() {
			/*
			Определяем продолжительность потока
			*/
			that.data.elapsed = streamElapsedTime = (new Date())-that.data.streamStartTime; 
			/*
			Определяем продолжительность стэка
			*/
			stackElapsedTime = (new Date())-that.data.stackStartTime; 
			/*
			Определяем продолжительность фрейма
			*/
			frameElapsedTime = (new Date())-that.data.frameStartTime; 
			/*
			Рассчитываем количество виртуальных кадров, которые вместилось в натуральный кадр. Т.е. при понижении
			производительности fps может упасть настолько, что в один фрейм начает помещаться несколько кадров. 
			Это количество -1 = choke. Т.е. первый кадр основной, остальные задержанные. Задержанные кадры являются
			виртуальными, при настройке maxChoke > 1, они вызовут событие frame, так же как и первый кадр.
			*/
			virtualFramesCount = Math.floor(frameElapsedTime/frameDuration);
			
			if (virtualFramesCount>1) {
				/*
				Срабатывание этого условия означает, что получен choke, т.е. лишний виртуальный кадр внутри одного 
				натурального. Это повод что бы понизить fps.
				*/
				slowdown();
				/*
				Если у нас есть choke, у нас может быть lose. Всё зависит от параметра maxChoke.
				*/
				if (virtualFramesCount-1>that.config.maxChoke) {
					/*
					Если эта виличина привысит maxChoke, то мы лишние кадры должны отбросить. Т.е. породив lose
					- потерянные кадры. 
					*/
					that.stats.lose = virtualFramesCount-that.config.maxChoke-1;
				} else {
					/*
					Иначе lose будет ровняться 0. Значение lose учитывается при вызове события _virtalFrame
					*/
					that.stats.lose = 0;
				}
			} else {
				/*
				Если получилось, что в натуральном фрейме не вместилось ни одного виртуального, значит fps
				слишком низок и его необходимо повысить.
				*/
				if (virtualFramesCount===0) { 
					rateup(); 
				}
			}
			/*
			Теперь когда мы знаем количество lose мы можем с уверенностью говорить о choke
			*/
			that.stats.choke = virtualFramesCount-1-that.stats.lose;
			/*
			Мы рассматриваем кадры как единое целого, имеющее свою продолжительность во времени. При 
			математическом расчете количество виртуальных кадров мы учитываем только целые кадры, от
			которых остался остаток, т.е фрагмент следующего виртуального кадра, который будет 
			сформирован в следующем наутельном фрейме.
			Этот остаток нам необходимо сохранить, что бы прибавить в следующем фрейме.
			Такой остаток актуален только если в натуральный фрейм попал хоть один виртуальный
			*/
			if (virtualFramesCount>0) {
				/*
				Получаем остаток
				*/
				residue = frameElapsedTime-(virtualFramesCount*frameDuration);
				/*
				Начинаем новый отсчет фрейма, исходя из разницы остатка
				*/
				that._fireFrameTimeCounting(-residue);
			}
			/*
			Провоцируем событие _virtualFrame для каждого виртуального кадра, отсекая lose
			*/
			for (i = virtualFramesCount;i>that.stats.lose;i--) {
				/*
				В Virtual frame мы передаем значение streamElapsedTime - т.е. сколько всего прошло ms с момента
				старта потока и текущий прогресс стэка.
				*/
				that._virtualFrame(
					streamElapsedTime, 
					(stackElapsedTime-(frameDuration*i))/that.config.duration
				);
			}
			/*
			Если достигнут предел продолжительности потока, мы провоцируем событие _end. И сбрасываем счетчик.
			Новый счетчик начинает отсчет с уточетом погрешности, т.е. остатка от нового стека.
			*/
			if (stackElapsedTime>=that.config.duration) {
				/*
				Вызываем событие _end
				*/
				that._end();
				/*
				Начинаем новый отсчет времени стэка
				*/
				that._fireStackTimeCounting(that.config.duration-stackElapsedTime);
				/*
				Переопределяем продолжительность стэка относительно нового значения для формирования
				текущего значения прогресса.
				*/
				stackElapsedTime = (new Date())-that.data.stackStartTime;
			}
			/*
			Устанавливаем текущее значение прогресса
			*/
			that.progress = stackElapsedTime/that.config.duration;
			/*
			Ожидаем следующего возможного натурального кадра
			*/
			if (that._running) that.requestFrame(frame);
		};
		/*
		Устанавливаем значение того, что кажры должны быть запрошены у системы
		*/
		this._running = true;
		/*
		Вызываем первый фрейм принудительно, т.е. запускам поток.
		*/
		frame();
		return this;
	};
	/*
	Указывает обработчик кадра и запускает поток, если он ещё не запущен.
	*/
	Stream.prototype.frame = function(callback) {
		this.bind('frame', callback);
		if (!this._running) this.start();
		return this;
	};
	/*
	Остановка потока
	*/
	Stream.prototype.stop = function() {
		if (this._running) {
			this.interval = false;
			this.trigger('stopped', [this.stats.elapsed, this.progress]);
		}
	};
	/*
	Событие _virtualFrame — для пользователя это обычный фрейм, но при установке choke>0 это событие может быть вызывано
	в одно мнгновение времени
	*/
	Stream.prototype._virtualFrame = function(elapsed, progress) {
		/*
		Провоцируем пользовательский эвент frame
		*/
		this.trigger('frame', [elapsed, progress]);
	};
	/*
	Событие окончания стэка.
	*/
	Stream.prototype._end = function() {
		/*
		Провоцируем пользовательское событие end
		*/
		this.trigger('end', []);
		/*
		Если включена опция infinity, мы продлжаем анимацию. Но при false значении поток закрывается.
		*/
		if (!this.config.infinity) {
			this.stop();
		}
	};
	/*
	Фиксирует время начала работы потока
	*/
	Stream.prototype._fireStreamTimeCounting = function(plus) {
		this.data.streamStartTime = new Date((new Date()).getTime()+(plus||0));
	};
	/*
	Фиксирует время начала сэка
	*/
	Stream.prototype._fireStackTimeCounting = function(plus) {
		this.data.stackStartTime = new Date((new Date()).getTime()+(plus||0));
	};
	/*
	Фиксирует время начала фрейма
	*/
	Stream.prototype._fireFrameTimeCounting = function(plus) {
		this.data.frameStartTime = new Date((new Date()).getTime()+(plus||0));
	};
	/*
	Фабрика потока для Anomaly
	*/
	Anomaly.prototype.stream = function(config) {
		return new Stream(config||{});
	};	

	/**
	force subprogram
	*/
		var Force = function() {

	};

	Force.prototype ={
		constructor: Force
	};	

	/**
	Глобализация Anomaly
	*/
	return new Anomaly();
})();

export default Anomaly;
import './lam';
import popup from './lib/popup';
import Brahma from './lib/Brahma';
import template from './template.html';
import styles from './less/lam.less';

function triggerHandler() {
	alert('Trigger');
}

function delay(callback) {
	return function() {
		var args = Array.from(arguments);
		setTimeout(function() {
			callback.apply(this, args);
		},1);
	}
}

const xPlaceholderRegEx = /{%[\s]?([a-z0-9_]*)[\s]?%}/ig;

function xreplace(text, data) {
	let match;
	while (match = xPlaceholderRegEx.exec(text)) {
		text = text.replace(match[0], data[match[1]]||'');
	}
	return text;
}

export default function deploy(container, location) {
	let destroyers = [];
	Brahma(container).html(xreplace(template, {
		location,
		cssScope: styles.lam
	}));

	var dollhouse = Brahma(container).app('dollhouse', {
	});
	// Brahma("#menu").find('>div>a').each(function() {
	// 	Brahma(this).bind('click', function() {
	// 		switch(Brahma(this).data('trigger')) {
	// 			case "gohome":
	// 				window.scrollTo(0, 0);
	// 			break;
	// 			default:
	// 				alert('В разработке!');
	// 			break;
	// 		}
	// 		return false;
	// 	});
	// });

	// Animation
	Brahma("[data-cartoon]").each(function() {
		var a = Brahma(this).app('cartoon');
		/* Автозапуск при наведении */
		if (Brahma(this).data('hoverplay')!==null) {
			Brahma(this).bind('mouseenter', function() {
				a.rewind().play();
			}).bind('mouseleave', function() {
			});
		};
		/* Автозапуск при видимости этажа */
		if (Brahma(this).data('seenplay')!==null) {
			dollhouse.getFloorByNode(Brahma(this).parent('.floor')[0]).bind('seen', function() {
				a.rewind().play();
			}).bind('lost', function() {
			});
		}
	});

	// Pincher
	var pincher = Brahma("#pincher-anima").app('cartoon', {
		cols:1,
		rows:27,
		fps:9,
		autoplay: false,
		loop: true,
		src: "lam/images/items/kompot.png"
	}),
	pincherPlayed=false,
	pincherPlay = function() {
		if (pincherPlayed) return false;
		Brahma.frame(function() {
			Brahma("#pincher-anima").addClass("walkp1");
			Brahma.frame(function() {
				pincher.play();
				setTimeout(function() {
					pincher.pause().goto(7);
					setTimeout(function() {
						Brahma("#pincher-anima").removeClass("walkp1").addClass("walkp2");
						pincher.play();
						setTimeout(function() {
							Brahma("#pincher-anima").removeClass("walkp2");
							pincherPlayed=false;
						},7000);
					}, 1000);
				}, 7000);
			});
		});
	}
	dollhouse.getFloorByNode(Brahma("#th6floor")[0]).bind('seen', function() {
		pincherPlay();
	});
	var AnimTurtle1, AnimTurtle2,tanim1,tanim2;


	// Birds in windows
	(function(b1,b2,b3,b4,b5,b6,b7) {
		dollhouse.getFloorByNode(Brahma("#floor-7")[0]).bind("seen", function() {
			if (!Brahma(b7).getApp('cartoon').isAnimated()) {
				Brahma(b1).getApp('cartoon').wake();
				Brahma(b2).getApp('cartoon').wake();
				Brahma(b3).getApp('cartoon').wake();
				Brahma(b4).getApp('cartoon').wake();
				Brahma(b5).getApp('cartoon').wake();
				Brahma(b6).getApp('cartoon').wake();
				Brahma(b7).getApp('cartoon').wake();
			}
		});
	})(
		Brahma("#birdinwindow1"),
		Brahma("#birdinwindow2"),
		Brahma("#birdinwindow3"),
		Brahma("#birdinwindow4"),
		Brahma("#birdinwindow5"),
		Brahma("#birdinwindow6"),
		Brahma("#birdinwindow7")
	);

	/*
	Обрабатываем кликабельность
	*/
	/* Клик на джентельмене*/
	Brahma("#anim-gentleman").bind('click', triggerHandler);

	/* Клик на жирафе */
	Brahma("#anim-giraffe").bind('click', triggerHandler);

	/* Клик на невесте */
	Brahma("#anim-maid").bind('click', triggerHandler);

	/* Клик на медведе */
	Brahma("#anim-gift").bind('click', triggerHandler);

	/* Клик на усах */
	Brahma("#anim-usi").bind('click', triggerHandler);

	/* Клик на торте */
	Brahma("#anim-tort").bind('click', triggerHandler);

	destroyers.push(() => {
		/* Клик на джентельмене*/
		Brahma("#anim-gentleman").unbind('click', triggerHandler);

		/* Клик на жирафе */
		Brahma("#anim-giraffe").unbind('click', triggerHandler);

		/* Клик на невесте */
		Brahma("#anim-maid").unbind('click', triggerHandler);

		/* Клик на медведе */
		Brahma("#anim-gift").unbind('click', triggerHandler);

		/* Клик на усах */
		Brahma("#anim-usi").unbind('click', triggerHandler);

		/* Клик на торте */
		Brahma("#anim-tort").unbind('click', triggerHandler);
	});

	destroyers.push(() => {
		Brahma(container).html('');
	});
}

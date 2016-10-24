export default function popup(source) {

	var pop = Brahma("body").app("overlay", {
		overlay: {
			style: {
				background: "rgba(0,0,0,0.5)"
			}
		},
		panel: {
			background: "#fff",
			padding: "10px"
		},
		effect:  {
			type: "hang",
			duration: 350
		},
		zIndex: 9999,
		escapeClose: true
	}).html("Loading...").show();
	var fillPopup = function(content) {
		pop.html(content);
		pop.html(function(node) {
			Brahma(node).find("[trigger=closepopup]").bind('click', function() {
				pop.close();
			});
		});
	};
	vendor(source, function(content) {
		fillPopup(content);
	});
}
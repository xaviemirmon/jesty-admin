
$( window ).load(function () {
	$(".container-fluid").animate({"opacity": "1"}, 700);
	$(".spinner-container").animate({"opacity": "0"}, 700).css("display","none");  
});
/* Open when someone clicks on the span element */
function openNav() {
	document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
}
document.onkeydown = function(evt) {
	evt = evt || window.event;
	var isEscape = false;
	if ("key" in evt) {
		isEscape = evt.key == "Escape";
	} else {
		isEscape = evt.keyCode == 27;
	}
	if (isEscape) {
		closeNav();
	}
};
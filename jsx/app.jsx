function getColor() {
	return JSON.stringify([
		app.foregroundColor.hsb.hue,
		app.foregroundColor.hsb.saturation,
		app.foregroundColor.hsb.brightness,
	]);
}

function setColor(hue, saturation, brightness) {
	app.foregroundColor.hsb.hue = hue;
	app.foregroundColor.hsb.saturation = saturation;
	app.foregroundColor.hsb.brightness = brightness;
}
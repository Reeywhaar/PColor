const CSGate = new CSInterface();
let darkenMode = "off";

function loadJSX(fileName) {
	const extensionRoot = CSGate.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
	return new Promise(resolve => {
		CSGate.evalScript('$.evalFile("' + extensionRoot + fileName + '")', () => {
			resolve();
		});
	})
}

function getColor(){
	return new Promise((resolve)=>{
		CSGate.evalScript("getColor()", (e) => resolve(JSON.parse(e)));
	});
}

function setColor(hue, saturation, brightness){
	return new Promise((resolve)=>{
		CSGate.evalScript(`setColor(${hue}, ${saturation}, ${brightness})`, (e) => resolve(e));
	});
}

let colorQueue = Promise.resolve();

async function setColorQueue(hue, saturation, brightness){
	colorQueue = colorQueue.then(() => setColor(hue, saturation, brightness)).catch(e => {
		console.error("cannot set color");
	});
	return colorQueue;
}

function max(a, b){
	return a > b ? a : b;
}

function min(a, b){
	return a < b ? a : b;
}

function bounded(min, max){
	return function(n){
		if(n < min) return min;
		if(n > max) return max;
		return n;
	}
}

async function changeHue(amount){
	const currentColor = await getColor();
	currentColor[0] = currentColor[0] - amount;
	await setColorQueue(currentColor[0], currentColor[1], currentColor[2]);
}

async function changeSaturation(amount){
	const currentColor = await getColor();
	currentColor[1] = bounded(0, 100)(currentColor[1] + amount);
	await setColorQueue(currentColor[0], currentColor[1], currentColor[2]);
}

async function changeBrightness(amount){
	const currentColor = await getColor();
	currentColor[2] = bounded(0, 100)(currentColor[2] - amount);
	await setColorQueue(currentColor[0], currentColor[1], currentColor[2]);
}

async function changeDarken(amount){
	const currentColor = await getColor();
	if(darkenMode === "cool"){
		currentColor[0] = currentColor[0] + (amount/2);
	}
	if(darkenMode === "warm"){
		currentColor[0] = currentColor[0] - (amount/2);
	}
	currentColor[1] = bounded(0, 100)(currentColor[1] + (amount*.8));
	currentColor[2] = bounded(0, 100)(currentColor[2] - amount);
	await setColorQueue(currentColor[0], currentColor[1], currentColor[2]);
}

async function changePower(amount){
	const currentColor = await getColor();
	currentColor[1] = bounded(0, 100)(currentColor[1] + amount);
	currentColor[2] = bounded(0, 100)(currentColor[2] + (amount/4));
	await setColorQueue(currentColor[0], currentColor[1], currentColor[2]);
}

function attachEvents(){
	const buttons = document.querySelectorAll(".color-property__button");
	for(let button of buttons){
		button.addEventListener("click", function(e){
			console.log("click");
			const amount = parseInt(this.textContent, 10);
			if(this.matches(".hue-button")){
				changeHue(amount);
			}
			if(this.matches(".saturation-button")){
				changeSaturation(amount);
			}
			if(this.matches(".value-button")){
				changeBrightness(amount);
			}
			if(this.matches(".darken-button")){
				changeDarken(amount);
			}
			if(this.matches(".power-button")){
				changePower(amount);
			}
		});
	}

	const hueInvertButton = document.querySelector(".hue-invert-button");
	hueInvertButton.addEventListener("click", () => {
		changeHue(180);
	});

	for(let radio of document.querySelectorAll(".darken-mode__radio")){
		radio.addEventListener("change", (e) => {
			darkenMode = document.querySelector(".darken-mode__radio:checked").value;
		});
	};
}

async function main(){
	await loadJSX("json2.js");
	await loadJSX("app.jsx");
	themeManager.init();
	attachEvents();
}

document.addEventListener("DOMContentLoaded", main);

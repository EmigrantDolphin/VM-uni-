const commandsArr = ["INC 01", "DEC 02", "MOV 03", "MOVC 04", "LSL 05", "LSR 06", "JMP 07", 
					 "JZ 08", "JNZ 09", "JFE 0a", "RET 0b", "ADD 0c", "SUB 0d", "XOR 0e", 
					 "OR 0f", "IN 10", "OUT 11", "RAND 12", "AND 13"];
var fileUploadTemplate = "";
var programNum = new Uint8Array(256);
var programNumUsed = 0;
var registersNum = new Uint8Array(16);
var curCommandAddress = 0;
var inputData = "";
var inputDataHead = 0;
var outputData = "";
var fastMode = false;

var interval;
const intervalDuration = 1;

var exitFlag = false;
var eofFlag = false
var flag = false;

function onLoad(){
	fillCommandList();
	fillRegisterLine();
	fileUploadTemplate = document.getElementById("fileUploadTemplate").innerHTML;
	document.getElementById("binFile").addEventListener('change', getBinFile, false);	
	document.getElementById("dataFile").addEventListener('change', getDataFile, false);
}

function fillRegisterLine(){
	let text = "";
	for (var i = 0; i < registersNum.length; i++){
		registersNum[i] = parseInt("00",16);
		if (registersNum[i].toString(16).length === 1)
			text += `<span id="reg${i}" class="border" style="display:inline-block;width:${100/20}%;margin:1px">0${registersNum[i].toString(16)}</span>`;
		else
			text += `<span id="reg${i}" class="border" style="display:inline-block;width:${100/20}%;margin:1px">${registersNum[i].toString(16)}</span>`;

	}
	document.getElementById("registerLine").innerHTML = text;
}

function runButton(){
	interval = setInterval(nextButton, intervalDuration);
}
function stopButton(){
	clearInterval(interval);
}
function fastButton(){
	fastMode = true;
	while(!exitFlag)
		nextButton();
}

function resetButton(){
	programNum = new Uint8Array(256);
	programNumUsed = 0;
	registersNum = new Uint8Array(16);
	curCommandAddress = 0;
	inputData = "";
	inputDataHead = 0;
	outputData = "";
	exitFlag = false;
	flag = false;
	eofFlag = false;
	fastMode = false;
	updateRegisters();
	updateProgram();
	document.getElementById("outData").innerHTML = outputData;
	document.getElementById("fileUploadTemplate").innerHTML = fileUploadTemplate;
	document.getElementById("binFile").addEventListener('change', getBinFile, false);	
	document.getElementById("dataFile").addEventListener('change', getDataFile, false);
	updateInData();
	stopButton();
	updateCommandList();
}

function nextButton(){	

	switch (programNum[curCommandAddress]){
		case 1:
			INC(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;
			break;
		case 2:
			DEC(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;
			break;
		case 3:
			MOV(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;
			break;
		case 4: 
			MOVC(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;		
			break;
		case 5:
			LSL(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;
			break;
		case 6:
			LSR(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress+=2;
			break;
		case 7:
			curCommandAddress = JMP(curCommandAddress, programNum[curCommandAddress+1]);
			break;
		case 8:
			curCommandAddress = JZ(curCommandAddress, programNum[curCommandAddress+1], flag);
			break;
		case 9:
			curCommandAddress = JNZ(curCommandAddress, programNum[curCommandAddress+1], flag);
			break;
		case 10:
			curCommandAddress = JFE(curCommandAddress, programNum[curCommandAddress+1], eofFlag);
			break;
		case 11:
			RET(interval);
			document.getElementById("outData").innerHTML = outputData;
			exitFlag = true;
			break;
		case 12:
			ADD(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 13:
			SUB(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 14:
			XOR(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 15:
			OR(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 16:
			IN(registersNum, programNum[curCommandAddress+1], inputData, inputDataHead);
			curCommandAddress += 2;
			if (inputDataHead >= inputData.length)
				eofFlag = true;
			inputDataHead++;
			break;
		case 17:
			outputData += OUT(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 18:
			RAND(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		case 19:
			AND(registersNum, programNum[curCommandAddress+1]);
			curCommandAddress += 2;
			break;
		default:
			console.log("WHAT THE ACTUAL FUCK");
	}
	if (!fastMode){
		updateRegisters();
		updateProgram();
		document.getElementById("outData").innerHTML = outputData;
		updateInData();
		updateCommandList();
	}
}

function updateInData(){
	var text = "<span style=\"background-color:yellow\">" + inputData.substr(0, inputDataHead) + "</span>" + inputData.substr(inputDataHead);
	document.getElementById("inData").innerHTML = text;
}

function updateCommandList(){
	let text = "";
	for (var i = 0; i < commandsArr.length; i++){
		if ( i+1 === programNum[curCommandAddress] )
			text += "<div style=\"background-color:yellow\">" + commandsArr[i] + "</div>";
		else
			text += "<div>" + commandsArr[i] + "</div>";
	}
	document.getElementById("commandList").innerHTML = text;
}

function updateProgram(){
	let text = "";
	for (var i = 0; i < programNumUsed; i++){
		if (curCommandAddress === i){
			if (programNum[i].toString(16).length === 1)
				text += `<span style="background-color: yellow">0${programNum[i].toString(16)} </span>`;
			else
				text += `<span style="background-color: yellow">${programNum[i].toString(16)} </span>`;
		}else{
			if (programNum[i].toString(16).length === 1)
				text += "0" + programNum[i].toString(16) + " ";
			else
				text += programNum[i].toString(16) + " ";
		}
	}
	document.getElementById("program").innerHTML = text;
}

function updateRegisters(){
	for (var i = 0; i < registersNum.length; i++)
		if (registersNum[i].toString(16).length === 1)
			document.getElementById(`reg${i}`).innerHTML = "0" + registersNum[i].toString(16);
		else
			document.getElementById(`reg${i}`).innerHTML = registersNum[i].toString(16);
}

function getDataFile(e){
	const reader = new FileReader();
	reader.onload = (evt) => {
		document.getElementById("inData").innerHTML = evt.target.result;
		inputData = evt.target.result;
	}
	reader.readAsText(e.target.files[0]);
}

function getBinFile(e){
	const reader = new FileReader();
	reader.onload = (evt) => {
		let res = evt.target.result;
		var text = "";
		programNumUsed = evt.target.result.length;
		for (var i = 0; i < res.length; i++)
			programNum[i] = res.charCodeAt(i);

		for (var i = 0; i < programNumUsed; i++){
			if (programNum[i].toString(16).length === 1)
				text += "0" + programNum[i].toString(16) + " ";
			else
				text += programNum[i].toString(16) + " ";
			
		}
		document.getElementById("program").innerHTML = text;
	}
	reader.readAsBinaryString(e.target.files[0]);
}

function fillCommandList(){
	let text = "";

	commandsArr.forEach(commandsArrLoop);
	document.getElementById("commandList").innerHTML = text;
	
	function commandsArrLoop(item, index){
		text += "<div>" + item + "</div>";
	}
}

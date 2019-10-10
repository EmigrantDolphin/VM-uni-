function getRX(constant){
	let rX = 0;
	rX = constant | parseInt("11110000", 2);
	rX = rX ^ parseInt("11110000", 2);
	return rX;
}
function getRY(constant){
	let rY = 0;
	rY = constant | parseInt("00001111", 2);
	rY = rY ^ parseInt("00001111", 2);
	rY = rY >>> 4;
	return rY;
}
function INC(registersNum, constant){
	let rX = getRX(constant);	
	registersNum[rX] += 1; 
	console.log("INC: " + registersNum[rX]);
}
function DEC(registersNum, constant){
	let rX = getRX(constant);
	registersNum[rX] -= 1; 
	console.log("DEC: " + registersNum[rX]);
}
function MOV(registersNum, constant){
	let rX = getRX(constant);
	let rY = getRY(constant);
	registersNum[rX] = registersNum[rY];
}
function MOVC(registersNum, constant){
	registersNum[0] = constant;
}
function LSL(registersNum, constant){
	let rX = getRX(constant);
	registersNum[rX] = registersNum[rX] << 1;
}
function LSR(registersNum, constant){
	let rX = getRX(constant);
	registersNum[rX] = registersNum[rX] >>> 1;
}
function JMP(curCommandAddress, constant){
	curCommandAddress += constant;
	if (curCommandAddress + constant > 255)		
		curCommandAddress -= 256;
	
	return curCommandAddress;
}
function JZ(curCommandAddress, constant, flag){
	if (flag)
		curCommandAddress = JMP(curCommandAddress, constant);
	else
		curCommandAddress += 2;
	return curCommandAddress;
}
function JNZ(curCommandAddress, constant, flag){
	if (!flag)
		curCommandAddress = JMP(curCommandAddress, constant);
	else
		curCommandAddress += 2;
	return curCommandAddress;
}
function JFE(curCommandAddress, constant, flag){
	if (flag)
		curCommandAddress = JMP(curCommandAddress, constant);
	else
		curCommandAddress += 2;
	return curCommandAddress;
}
function RET(interval){
	clearInterval(interval);
}
function ADD(registersNum, constant){
	let rX = getRX(constant);
	let rY = getRY(constant);
	registersNum[rX] += registersNum[rY];
}
function SUB(registersNum, constant){
	let rX = getRX(constant);
	let rY = getRY(constant);
	registersNum[rX] -= registersNum[rY];
}
function XOR(registersNum, constant){
	let rX = getRX(constant);
	let rY = getRY(constant);
	registersNum[rX] = registersNum[rX] ^ registersNum[rY];
}
function OR(registersNum, constant){
	let rX = getRX(constant);
	let rY = getRY(constant);
	registersNum[rX] = registersNum[rX] | registersNum[rY];
}
function IN(registersNum, constant, data, dataCounter){
	let rX = getRX(constant);
	registersNum[rX] = data.charCodeAt(dataCounter);
}
function OUT(registersNum, constant){
	let rX = getRX(constant);
	return String.fromCharCode(registersNum[rX]);
}
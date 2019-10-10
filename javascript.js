const commandsArr = ["INC", "DEC", "MOV", "MOVC", "LSL", "LSR", "JMP", 
					 "JZ", "JNZ", "JFE", "RET", "ADD", "SUB", "XOR", 
					 "OR", "IN", "OUT"];
function onLoad(){
	fillCommandList();
	document.getElementById("files").addEventListener('change', getFile, false);	
}

function getFile(e){
	const input = e.target;
	const reader = new FileReader();
	reader.onload = (e) => {
		//document.getElementById("program").innerHTML = e.target.result.toString(2);
		let res = e.target.result;
		var text = "";
		for (var i = 0; i < res.length; i++){
			text += parseInt(res.charCodeAt(i)).toString(16) + " ";
		}
		document.getElementById("program").innerHTML = text;
	}
	reader.readAsBinaryString(input.files[0]);
}

function fillCommandList(){
	let text = "";
	let commandList = document.getElementById("commandList");
	
	commandsArr.forEach(commandsArrLoop);
	
	function commandsArrLoop(item, index){
		commandList.innerHTML += "<div>" + item + "</div>";
	}
}

const codeEditor   = $('.code');
const resultViewer = $('.result');
const memoryViewer = $('.memory');
const codeViewer   = $('.debug');

var code        = '';
var memory      = [];
var result      = '';
var codeIndex   = 0;
var memoryIndex = 0;

var interval = 50; // 実行速度
var timerID = false;
var loopCounter = 0;

function init(running) {
	// メモリの初期化
	memori = [];
	for(let i = 0; i < 64; i++) {
		memory[i] = 0;
	}

	code = codeEditor.value;
	result = '';
	codeIndex = 0;
	memoryIndex = 0;

	// 実行速度を取得
	interval = $('.speed').value;

	// ボタンの状態を戻す
	$('.resume').style.display = 'none';
	$('.stop').style.display = 'inline-block';

	show(running);
}

function finish() {
	$('.resume').style.display = 'none';
	$('.stop').style.display = 'inline-block';
}

function execute() {
	if(codeIndex >= code.length) {
		finish();
		show(true);
		return;
	}
	
	let x = code[codeIndex];
	
	switch(x) {
		case '+':
			memory[memoryIndex]++;
			break;
		case '-':
			memory[memoryIndex]--;
			break;
		case '>':
			memoryIndex++;
			break;
		case '<':
			memoryIndex--;
			break;
		case ',':
			let c = window.prompt("入力してください", "");
			if(c) {
				c = c.slice(0, 1).charCodeAt(0);
				memory[memoryIndex] = c;
			}
			break;
		case '.':
			result += String.fromCharCode(memory[memoryIndex]);
			break;
		case '[':
			if(memory[memoryIndex] == 0) {
				let n = 1;
				for(let i = codeIndex + 1; i < code.length; i++) {
					if(code[i] == '[') {
						n++;
					} else if(code[i] == ']') {
						n--;
					}
					if(n == 0) {
						codeIndex = i;
						break;
					}
				}
			}
			break;
		case ']':
			if(memory[memoryIndex] != 0) {
				let n = 1;
				for(let i = codeIndex - 1; i > 0; i--) {
					if(code[i] == ']') {
						n++;
					} else if(code[i] == '[') {
						n--;
					}
					if(n == 0) {
						codeIndex = i - 1;
						break;
					}
				}
			}
			break;
		default:
	}
	
	if(true) {
		codeIndex++;
	}
	
	if(interval == 'fastest') {
		loopCounter++;
		if(loopCounter % 1000 == 0) {
			setTimeout(execute, 0);
		} else {
			execute();
		}
	} else {
		show(true);
		timerID = setTimeout(execute, interval);
	}
}

function show(running) {
	if(running) {
		// 実行中のコードを表示
		let cd = '';
		for(let i = 0; i < code.length; i++) {
			let active = '';
			if(i == codeIndex) active = 'active';
			cd += '<span class="cd '+ active +'">'+ code[i] +'</span>'
		}
		codeViewer.html(cd);

		// 出力結果を表示
		resultViewer.html(escape_html(result));
	}
	
	/* メモリーを表示する */
	let mmr = '';
	for(let i = 0; i < memory.length; i++) {
		let active = '';
		if(running && i == memoryIndex) active = 'active';
		mmr += '<span class="mmr '+ active +'">'+ numberChange(memory[i]) +'</span>';
		if(i % 32 == 31) { mmr += '<br>'; }
	}
	memoryViewer.html(mmr);
}

function numberChange(n) {
	n = n || 0;
	let size = -4;
	n = '' + n;

	if(n >= 0 && n <= 9999) {
		// n = '000' + n.toString(16);
		n = '0000' + n;
		n = n.slice(size);
	}
	return n;
}

function uppercase(s) {
	return s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);});
}

function $(querySelector) {
	let d = document.querySelector(querySelector);
	
	d.html = function(s) { d.innerHTML = s; }
	d.val  = function(s) { d.value = s; }

	return d;
}

$('.execute').onclick = function() {
	clearTimeout(timerID);
	init(true);
	timerID = setTimeout(execute, interval);
}

$('.stop').onclick = function() {
	stopCode();
}

function stopCode() {
	clearTimeout(timerID);
	$('.stop').style.display = 'none';
	$('.resume').style.display = 'inline-block';
}

$('.resume').onclick = function() {
	clearTimeout(timerID);
	interval = $('.speed').value;
	show(true);
	timerID = setTimeout(execute, interval);
	this.style.display = 'none';
	$('.stop').style.display = 'inline-block';
}

function escape_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}

init();
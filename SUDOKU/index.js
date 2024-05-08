var sudokuc=[[],[],[],[],[],[],[],[],[]];

function createGrid() {
    var table = document.getElementById('table');
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var myinput = document.createElement('input');
            myinput.id = `${i}${j}`;
            var number = Math.ceil(Math.random() * 9);
            myinput.row = i;
            myinput.col = j;
            if (isSafe(sudokuc, i, j, number)) {
                myinput.value = number;
                myinput.readOnly = true;
            } else {
                number = 0;
                myinput.value = '';
            }
            sudokuc[i][j] = number;
            table.appendChild(myinput);
            myinput.oninput = function(e) {
                checkAnswer(sudokuc, e);
            };
        }
    }
}

function isSafe(grid, row, col, num) {
    for (var x = 0; x < 9; x++) {
        if (grid[row][x] == num) {
            return false;
        }
    }
    for (var y = 0; y < 9; y++) {
        if (grid[y][col] == num) {
            return false;
        }
    }
    var startRow = row - (row % 3);
    var startCol = col - (col % 3);
    for (var m = 0; m < 3; m++) {
        for (var n = 0; n < 3; n++) {
            if (grid[m + startRow][n + startCol] == num) {
                return false;
            }
        }
    }
    return true;
}

createGrid();

function checkAnswer(grid, e) {
    var row = e.target.row;
    var col = e.target.col;
    var num = Number(e.target.value);
    var id = e.target.id;
    if (num == '') {
        return false;
    }
    if (num > 0 && num <= 9) {
        if (isSafe(grid, row, col, num)) {
            showColors('green', id);
            speakCorrect(); // Speak "Correct"
            return true;
        } else {
            showColors('red', id);
            play();
            return false;
        }
    } else {
        showColors('red', id);
        play();
        return false;
    }
}

function showColors(color, id) {
    var inp = document.getElementById(id);
    if (color == 'red') {
        inp.style.backgroundColor = 'red';
    } else {
        inp.style.backgroundColor = 'green';
    }
}

const reloadButton = document.querySelector("#reload");

function reload() {
    location.reload();
}

reloadButton.addEventListener("click", reload, false);

function play() {
    var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    audio.play();
}

// Function to speak "Correct" when a correct digit is entered
function speakCorrect() {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance("Correct");
    synth.speak(utterance);
}

// Function to vibrate the device
function vibrateDevice() {
    // Check if the vibration API is supported
    if ("vibrate" in navigator) {
        // Vibrate for 100 milliseconds
        navigator.vibrate(100);
    }
}

// Add event listener for mouseover event on input elements
document.querySelectorAll('input').forEach(item => {
    item.addEventListener('mouseover', event => {
        // Get the content in the cell
        var content = event.target.value;

        // Speak the digit or "empty"
        if (content) {
            speakContent(content);
        } else {
            speakContent("empty");
        }
    });
});

// Add event listener for mouseover event on input elements for haptic feedback
document.querySelectorAll('input').forEach(item => {
    item.addEventListener('mouseover', event => {
        // Get the cell coordinates
        var row = event.target.row;
        var col = event.target.col;

        // Check if the cell is a border cell
        if (row === 0 || row === 8 || col === 0 || col === 8) {
            // Vibrate the device for haptic feedback
            vibrateDevice();
        }
    });
});

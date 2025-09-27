class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.soundEnabled = true;
        this.theme = 'light';
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createBoard();
        this.updateDisplay();
        this.loadFromStorage();
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        this.board.forEach((_, index) => {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.index = index;
            cell.addEventListener('click', () => this.handleCellClick(index));
            gameBoard.appendChild(cell);
        });
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        this.playSound('click');

        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.board.every(cell => cell !== '')) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }

    updateCell(index) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = this.board[index];
        cell.classList.add(this.board[index].toLowerCase());
        
        // Add click animation
        cell.style.transform = 'scale(0.8)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 150);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(pattern);
                return true;
            }
        }
        return false;
    }

    highlightWinningCells(pattern) {
        pattern.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('win');
        });
        
        this.drawWinningLine(pattern);
    }

    drawWinningLine(pattern) {
        const winningLine = document.getElementById('winningLine');
        const gameBoard = document.getElementById('gameBoard');
        const cellSize = gameBoard.offsetWidth / 3;
        
        const [a, b, c] = pattern;
        const startCell = document.querySelector(`[data-index="${a}"]`);
        const endCell = document.querySelector(`[data-index="${c}"]`);
        
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        
        const angle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
        const length = Math.sqrt(Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2));
        
        winningLine.style.width = length + 'px';
        winningLine.style.transform = `rotate(${angle}rad)`;
        winningLine.style.left = (startRect.left + startRect.width/2 - boardRect.left) + 'px';
        winningLine.style.top = (startRect.top + startRect.height/2 - boardRect.top) + 'px';
        winningLine.style.opacity = '1';
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.playSound('win');
        this.showConfetti();
        
        document.getElementById('gameStatus').textContent = `Player ${this.currentPlayer} Wins! 🎉`;
        this.saveToStorage();
        
        setTimeout(() => {
            this.resetBoard();
        }, 3000);
    }

    handleDraw() {
        this.gameActive = false;
        this.playSound('draw');
        document.getElementById('gameStatus').textContent = "It's a Draw! 🤝";
        
        setTimeout(() => {
            this.resetBoard();
        }, 2000);
    }

    resetBoard() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        
        document.getElementById('winningLine').style.opacity = '0';
        this.createBoard();
        this.updateDisplay();
    }

    resetGame() {
        this.scores = { X: 0, O: 0 };
        this.resetBoard();
        this.updateScores();
        this.saveToStorage();
    }

    updateDisplay() {
        document.getElementById('currentPlayer').innerHTML = 
            `Current Player: <span class="player-${this.currentPlayer.toLowerCase()}">${this.currentPlayer}</span>`;
        
        if (this.gameActive) {
            document.getElementById('gameStatus').textContent = "Game On! 🚀";
        }
    }

    updateScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        const sounds = {
            click: document.getElementById('clickSound'),
            win: document.getElementById('winSound'),
            draw: document.getElementById('drawSound')
        };
        
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundBtn');
        soundBtn.textContent = this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const themeBtn = document.getElementById('themeBtn');
        themeBtn.textContent = this.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
        
        this.saveToStorage();
    }

    showConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiPieces = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#6bcf7f', '#9b59b6'];

        for (let i = 0; i < 150; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * 360,
                spin: Math.random() * 10 - 5
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let piecesActive = false;
            
            confettiPieces.forEach(piece => {
                piece.y += piece.speed;
                piece.x += Math.sin(piece.angle * Math.PI / 180) * 0.5;
                piece.angle += piece.spin;
                
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.angle * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
                ctx.restore();
                
                if (piece.y < canvas.height) {
                    piecesActive = true;
                }
            });
            
            if (piecesActive) {
                requestAnimationFrame(animateConfetti);
            }
        }

        animateConfetti();
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
        document.getElementById('soundBtn').addEventListener('click', () => this.toggleSound());
    }

    saveToStorage() {
        const gameData = {
            scores: this.scores,
            theme: this.theme,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('ticTacToe', JSON.stringify(gameData));
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('ticTacToe');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.scores = gameData.scores || this.scores;
            this.theme = gameData.theme || this.theme;
            this.soundEnabled = gameData.soundEnabled !== undefined ? gameData.soundEnabled : true;
            
            document.documentElement.setAttribute('data-theme', this.theme);
            document.getElementById('soundBtn').textContent = this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
            document.getElementById('themeBtn').textContent = this.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
            this.updateScores();
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TicTacToeScene = /** @class */ (function (_super) {
    __extends(TicTacToeScene, _super);
    function TicTacToeScene() {
        return _super.call(this, { key: 'TicTacToeScene' }) || this;
    }
    TicTacToeScene.prototype.preload = function () {
        this.load.image('empty', 'assets/empty.png');
    };
    TicTacToeScene.prototype.create = function () {
        var _this = this;
        var _a;
        var boardSize = 5;
        var tileSize = 100;
        this.currentPlayer = 1;
        this.board = [];
        var _loop_1 = function (row) {
            this_1.board[row] = [];
            var _loop_2 = function (col) {
                var tileBg = this_1.add.rectangle(this_1.tileDestination(col), this_1.tileDestination(row), tileSize, tileSize, 0xffffff).setOrigin(0.5);
                var tile = this_1.add.image(this_1.tileDestination(col), this_1.tileDestination(row), 'empty').setOrigin(0.5);
                tile.setDisplaySize(tileSize, tileSize);
                tileBg.setInteractive();
                tileBg.on('pointerdown', function () { return _this.handleTileClick(row, col); });
                (_a = this_1.tiles) === null || _a === void 0 ? void 0 : _a.push(tile);
                this_1.board[row][col] = null;
                if (row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1) {
                    tile.visible = false;
                    tileBg.visible = false;
                    this_1.board[row][col] = '';
                }
            };
            for (var col = 0; col < boardSize; col++) {
                _loop_2(col);
            }
        };
        var this_1 = this;
        for (var row = 0; row < boardSize; row++) {
            _loop_1(row);
        }
    };
    TicTacToeScene.prototype.tileDestination = function (pos) {
        var tileSize = 100;
        var tileSpace = 10;
        return pos * (tileSize + tileSpace) + tileSize / 2 + tileSpace;
    };
    TicTacToeScene.prototype.handleTileClick = function (row, col) {
        var currentPlayer = this.currentPlayer === 1 ? 'X' : 'O';
        if (this.checkForWin(currentPlayer)) {
            console.log("".concat(currentPlayer, " Win!"));
            this.scene.restart();
        }
        if (this.checkForWin('X') || this.checkForWin('O')) {
            return;
        }
        if (this.board && this.board[row][col] === null) {
            var symbol = this.add.text(this.tileDestination(col), this.tileDestination(row), currentPlayer, { fontSize: '32px', color: '#000000' });
            symbol.setOrigin(0.5);
            this.board[row][col] = currentPlayer;
            this.checkBoard();
            this.makeAIMove();
        }
    };
    TicTacToeScene.prototype.checkForWin = function (player) {
        if (!this.board)
            return false;
        var boardSize = this.board.length;
        for (var row = 0; row < boardSize; row++) {
            var rowCount = 0;
            for (var col = 0; col < boardSize; col++) {
                if (this.board[row][col] === player) {
                    rowCount++;
                }
            }
            if (rowCount === boardSize) {
                return true;
            }
        }
        for (var col = 0; col < boardSize; col++) {
            var colCount = 0;
            for (var row = 0; row < boardSize; row++) {
                if (this.board[row][col] === player) {
                    colCount++;
                }
            }
            if (colCount === boardSize) {
                return true;
            }
        }
        var diagonalCount = 0;
        var antiDiagonalCount = 0;
        for (var i = 0; i < boardSize; i++) {
            if (this.board[i][i] === player) {
                diagonalCount++;
            }
            if (this.board[i][boardSize - 1 - i] === player) {
                antiDiagonalCount++;
            }
        }
        if (diagonalCount === boardSize || antiDiagonalCount === boardSize) {
            return true;
        }
        return false;
    };
    TicTacToeScene.prototype.makeAIMove = function () {
        if (!this.board)
            return;
        var boardSize = this.board.length;
        console.log(boardSize);
        if (this.checkForWin('X') || this.checkForWin('O')) {
            return;
        }
        var visibleTiles = [];
        for (var row_1 = 0; row_1 < boardSize; row_1++) {
            for (var col_1 = 0; col_1 < boardSize; col_1++) {
                if (this.board[row_1][col_1] === null) {
                    visibleTiles.push({ row: row_1, col: col_1 });
                }
            }
        }
        if (visibleTiles.length === 0) {
            return;
        }
        var randomIndex = Phaser.Math.RND.between(0, visibleTiles.length - 1);
        var _a = visibleTiles[randomIndex], row = _a.row, col = _a.col;
        var symbol = this.add.text(this.tileDestination(col), this.tileDestination(row), 'O', { fontSize: '32px', color: '#000000' });
        symbol.setOrigin(0.5);
        this.board[row][col] = 'O';
        if (this.checkForWin('O')) {
            console.log('AI победил!');
            this.scene.restart();
        }
    };
    TicTacToeScene.prototype.isTileVisible = function (row, col) {
        if (!this.board)
            return false;
        var boardSize = this.board.length;
        return !(row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1);
    };
    TicTacToeScene.prototype.checkBoard = function () {
        if (!this.board)
            return;
        var boardSize = this.board.length;
        var filledTiles = 0;
        for (var row = 0; row < boardSize; row++) {
            for (var col = 0; col < boardSize; col++) {
                if (this.board[row][col] !== null) {
                    filledTiles++;
                }
            }
        }
        if (filledTiles >= 20) {
            this.showHiddenTiles();
        }
    };
    TicTacToeScene.prototype.showHiddenTiles = function () {
        var _this = this;
        var tileSize = 100;
        if (!this.board)
            return;
        var boardSize = this.board.length;
        var _loop_3 = function (row) {
            var _loop_4 = function (col) {
                var tile = this_2.board[row][col];
                if (tile === '') {
                    var tileBg = this_2.add.rectangle(this_2.tileDestination(col), this_2.tileDestination(row), tileSize, tileSize, 0xffffff).setOrigin(0.5);
                    var tileImage = this_2.add.image(this_2.tileDestination(col), this_2.tileDestination(row), 'empty').setOrigin(0.5);
                    tileImage.setDisplaySize(tileSize, tileSize);
                    tileBg.setInteractive();
                    tileBg.on('pointerdown', function () { return _this.handleTileClick(row, col); });
                    this_2.board[row][col] = null;
                }
            };
            for (var col = 0; col < boardSize; col++) {
                _loop_4(col);
            }
        };
        var this_2 = this;
        for (var row = 0; row < boardSize; row++) {
            _loop_3(row);
        }
    };
    return TicTacToeScene;
}(Phaser.Scene));
var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: [TicTacToeScene],
});

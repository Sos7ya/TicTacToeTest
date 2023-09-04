
import 'phaser';


class TicTacToeScene extends Phaser.Scene {
  private board?: (string | null)[][];
  private currentPlayer?: number;
  private tiles?: any[];
    constructor() {
        super({ key: 'TicTacToeScene' });
    }

    preload() {
        this.load.image('empty', 'assets/empty.png');
    }

    create() {
      const boardSize = 5;
      const tileSize = 100;
      this.currentPlayer = 1;
      this.board = [];
      
      for (let row = 0; row < boardSize; row++) {
        this.board[row] = [];
        for (let col = 0; col < boardSize; col++) {
          const tileBg = this.add.rectangle(this.tileDestination(col),
            this.tileDestination(row),
           tileSize, tileSize, 0xffffff).setOrigin(0.5)
    
          const tile = this.add.image(
            this.tileDestination(col),
            this.tileDestination(row),
           'empty'
          ).setOrigin(0.5);
    
          tile.setDisplaySize(tileSize, tileSize)
          
          tileBg.setInteractive();
          
          tileBg.on('pointerdown', () => this.handleTileClick(row, col));
          
          this.tiles?.push(tile);

          this.board[row][col] = null;
    
          if (row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1) {
            tile.visible = false;
            tileBg.visible = false;
            this.board[row][col] = '';
          }
        }
      }
    }

    tileDestination(pos:number) {
      const tileSize = 100;
      const tileSpace = 10
      return pos * (tileSize + tileSpace) + tileSize / 2 + tileSpace
    }

    handleTileClick(row: number, col: number) {

      const currentPlayer = this.currentPlayer === 1 ? 'X' : 'O';
      if(this.checkForWin(currentPlayer)){
        console.log(`${currentPlayer} Win!`);
        this.scene.restart();
      }
      if(this.checkForWin('X') || this.checkForWin('O')){
        return;
      }
      
      if (this.board && this.board[row][col] === null) {
        const symbol = this.add.text(
          this.tileDestination(col),
          this.tileDestination(row),
          currentPlayer,
          { fontSize: '32px', color: '#000000' }
        );
        symbol.setOrigin(0.5);
        
        this.board[row][col] = currentPlayer;
        
        this.checkBoard();
        this.makeAIMove();
    }
  }

    checkForWin(player: string): boolean {
      if(!this.board) return false;
      const boardSize = this.board.length;

      for (let row = 0; row < boardSize; row++) {
        let rowCount = 0;
        for (let col = 0; col < boardSize; col++) {
          if (this.board[row][col] === player) {
            rowCount++;
          }
        }
        if (rowCount === boardSize) {
          return true;
        }
      }
      
      for (let col = 0; col < boardSize; col++) {
        let colCount = 0;
        for (let row = 0; row < boardSize; row++) {
          if (this.board[row][col] === player) {
            colCount++;
          }
        }
        if (colCount === boardSize) {
          return true;
        }
      }
      
      let diagonalCount = 0;
      let antiDiagonalCount = 0;
      for (let i = 0; i < boardSize; i++) {
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
    }

    makeAIMove() {
      if (!this.board) return;
      const boardSize = this.board.length;
      console.log(boardSize);
      
      if (this.checkForWin('X') || this.checkForWin('O')) {
        return;
      }
      
      const visibleTiles: { row: number, col: number }[] = [];
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (this.board[row][col] === null) {
            visibleTiles.push({ row, col });
          }
        }
      }
      
      if (visibleTiles.length === 0) {
        return;
      }
      
      const randomIndex = Phaser.Math.RND.between(0, visibleTiles.length - 1);
      const { row, col } = visibleTiles[randomIndex];
      
      const symbol = this.add.text(
        this.tileDestination(col),
        this.tileDestination(row),
        'O',
        { fontSize: '32px', color: '#000000' }
      );
      symbol.setOrigin(0.5);
      
      this.board[row][col] = 'O';
      
      if (this.checkForWin('O')) {
        console.log('AI победил!');
        this.scene.restart();
      }
    }

    isTileVisible(row: number, col: number): boolean {
      if(!this.board) return false;
      const boardSize = this.board.length;
      return !(row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1);
    }

    checkBoard() {
      if (!this.board) return;
      const boardSize = this.board.length;

      let filledTiles = 0;
    
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (this.board[row][col] !== null) {
            filledTiles++;
          }
        }
      }
    
      if (filledTiles >= 20) {
        this.showHiddenTiles();
      }
    }

    showHiddenTiles() {
      const tileSize = 100
      if (!this.board) return;
      const boardSize = this.board.length;
    
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          const tile = this.board[row][col];
    
          if (tile === '') {
            const tileBg = this.add.rectangle(
              this.tileDestination(col),
              this.tileDestination(row),
              tileSize,
              tileSize,
              0xffffff
            ).setOrigin(0.5);
    
            const tileImage = this.add.image(
              this.tileDestination(col),
              this.tileDestination(row),
              'empty'
            ).setOrigin(0.5);
    
            tileImage.setDisplaySize(tileSize, tileSize);
            tileBg.setInteractive();
            tileBg.on('pointerdown', () => this.handleTileClick(row, col));
    
            this.board[row][col] = null;
          }
        }
      }
    }
    
    

  }

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: [TicTacToeScene],
});
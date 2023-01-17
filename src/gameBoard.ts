export abstract class GameBoard {
    container: HTMLElement|null
    rows: number
    columns: number
    board: HTMLElement|null
    first_click: boolean

    constructor(container: HTMLElement, rows: number, columns: number) {
        this.container = container
        this.rows = rows
        this.columns = columns
        this.board = null
        this.first_click = true
        
        if(container == null) {
            console.error('Something went wrong.')
            return
        }
    }

    createCell(x: number, y: number, index: string): HTMLElement {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.x = x.toString()
        cell.dataset.y = y.toString()
        cell.dataset.isChecked = '0'
        cell.dataset.index = index

        return cell
    }

    getAllCells(): any[] {
        return Array.from(this.getBoard().querySelectorAll(`.cell`))
    }

    getCellByXY(x: number, y: number): HTMLElement {
        return this.getBoard().querySelector(`.cell[data-x="${x}"][data-y="${y}"]`)! as HTMLElement
    }

    getBoard() {
        if(this.board) return this.board
        let board = document.createElement('div')
        board.id = 'board'
        this.board = board
        return board
    }

    getDifficulty(): string {
        let difficulty_selector = document.querySelector('.difficulty-selector') as HTMLElement
        if(difficulty_selector != null && difficulty_selector.dataset.difficulty) {
            return difficulty_selector.dataset.difficulty
        }
        return 'normal'
    }

    setDifficulty(difficulty: string|null) {
        if(!difficulty) {
            difficulty = this.getDifficulty()
        } else {
            document.querySelector<HTMLElement>('.difficulty-selector')!.dataset.difficulty = difficulty
        }
        
        switch(difficulty) {
            case 'easy':
                break
            case 'normal':
                break
            case 'hard':
                break
            default:
                break
        }
    }

    generateBoard() {
        console.log('Generating game board')
        let cells: HTMLElement[] = []
        let index: number = 1
        let difficulty: string = this.getDifficulty()

        this.getBoard()!.className = difficulty
        

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                let cell = this.createCell(i, j, index.toString())
                this.appendCell(cell)
                cells.push(cell)
                index++
            }
        }
    }

    scanBoard() {
        return new Promise(resolve => {
            console.log('Scanning game board')
    
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.columns; j++) {
                    let cell = this.getCellByXY(i, j)

                }
            }

            resolve(true)
        })
    }

    async resetBoard() {
        this.getBoard().innerHTML = ''
        this.setDifficulty(null)
        this.generateBoard()
        this.first_click = true
    }


    appendCell(cell: HTMLElement) {
        let board = this.getBoard()
        board.appendChild(cell)
    }

    render() {
        let board = this.getBoard()
        this.container?.append(board)
        this.setDifficulty(null)
        this.generateBoard()
        this.first_click = true
    }

    leftClick(clicked_cell: any): void {
        if(false) {
            this.winGame()
        }

        if(!clicked_cell) return
        if(clicked_cell.dataset.isChecked == '1') return

        let x = parseInt(clicked_cell.dataset.x)
        let y = parseInt(clicked_cell.dataset.y)

    }

    rightClick(cell: any): void {
        if(cell.dataset.isChecked == '1') return
    }

    async firstClick(cell: any) {
        // console.log('first click!')

        await this.scanBoard()
        this.leftClick(cell)
    }

    loseGame() {
        setTimeout(() => {
            alert('You lose!')
            this.resetBoard()
        }, 5)
    }
    winGame() {
        // alert('You Win!!')
        this.resetBoard()
    }

    initEventListeners() {
        let board = this.getBoard()
        board.addEventListener('mousedown', (e): void => {
            e.preventDefault()
            let target = e.target as HTMLElement
            if(target == null) return
            if(!target.classList.contains('cell')) return

            if(this.first_click) {
                this.firstClick(target)
                this.first_click = false
            } else {
                if(e.button === 2 || (e.button === 0 && e.altKey === true)) {
                    this.rightClick(target)
                } else {
                    this.leftClick(target)
                }
            }
        })
    }
}
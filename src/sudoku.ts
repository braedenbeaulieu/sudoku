import { GameBoard } from './gameBoard'

let preload_array = [{"x":"1","y":"1","val":"3"},{"x":"1","y":"4","val":"6"},{"x":"1","y":"5","val":"1"},{"x":"1","y":"9","val":"8"},{"x":"2","y":"3","val":"2"},{"x":"2","y":"5","val":"3"},{"x":"2","y":"7","val":"7"},{"x":"2","y":"8","val":"6"},{"x":"3","y":"4","val":"7"},{"x":"3","y":"5","val":"5"},{"x":"3","y":"7","val":"2"},{"x":"3","y":"8","val":"9"},{"x":"4","y":"2","val":"9"},{"x":"4","y":"4","val":"8"},{"x":"4","y":"8","val":"1"},{"x":"5","y":"2","val":"4"},{"x":"5","y":"4","val":"1"},{"x":"5","y":"5","val":"7"},{"x":"5","y":"6","val":"3"},{"x":"5","y":"8","val":"5"},{"x":"6","y":"2","val":"5"},{"x":"6","y":"6","val":"9"},{"x":"6","y":"8","val":"2"},{"x":"7","y":"2","val":"3"},{"x":"7","y":"3","val":"7"},{"x":"7","y":"5","val":"4"},{"x":"7","y":"6","val":"1"},{"x":"8","y":"2","val":"2"},{"x":"8","y":"3","val":"5"},{"x":"8","y":"5","val":"8"},{"x":"8","y":"7","val":"9"},{"x":"9","y":"1","val":"4"},{"x":"9","y":"6","val":"9"},{"x":"9","y":"7","val":"7"},{"x":"9","y":"9","val":"2"}]

export class Sudoku extends GameBoard {
    row_of_boxes: number

    constructor(container: HTMLElement, rows: number, columns: number) {
        super(container, rows, columns)

        this.row_of_boxes = 0

        this.initEventListeners()
    }

    createBoxCell(index: string, count: string, x: string, y: string): HTMLElement {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.isChecked = '0'
        cell.dataset.index = index
        cell.dataset.count = count

        cell.classList.add(x)
        cell.classList.add(y)
        cell.dataset.x = x
        cell.dataset.y = y

        return cell
    }

    createBox(index: number, x_delta: number, y_delta: number): HTMLElement {
        let box = document.createElement('div')
        box.classList.add('box')
        box.dataset.index = index.toString()

        for(let i = 1; i <= 3; i++) {
            for(let j = 1; j <= 3; j++) {
                // console.log(y_delta)
                // let x = (i - (index % 3))
                let x = i + x_delta
                let y = j + y_delta

                // console.log(i * j)
                
                // console.log(parseInt(index))
                // console.log(x)
                // console.log(grid_array[j])
                // console.log(i)
                // console.log(j)

                // index = (index * 9) + i
                let cell = this.createBoxCell(i.toString(), index.toString(), x.toString(), y.toString())
                box.appendChild(cell)
            }
        }

        return box
    }

    outputBoardPreload() {
        let preload_json = []
        for(let i = 1; i <= 9; i++) {
            for(let j = 1; j <= 9; j++) {
                let cell = document.querySelector('[data-x="' + i + '"][data-y="' + j + '"]') as HTMLElement
                let cell_number = cell.querySelector('p')
                if(cell_number) {
                    preload_json.push({
                        x: cell.dataset.x,
                        y: cell.dataset.y,
                        val: cell.querySelector('p')?.innerHTML
                    })            
                }

            }
        }
        console.log(JSON.stringify(preload_json))
    }

    preloadBoard(preload_json: {}) {
        console.log(preload_json)
    }

    generateBoard() {
        console.log('Generating game board')
        let boxes: HTMLElement[] = []
        let index: number = 1
        let difficulty: string = this.getDifficulty()

        this.getBoard()!.className = difficulty
        let y_delta = 0
        let x_delta = 0

        for(let i = 0; i < 9; i++) {
            let box = this.createBox(index, x_delta, y_delta)
            this.appendBox(box)
            boxes.push(box)
            y_delta += 3
            if(y_delta > 6) {
                y_delta = 0
                x_delta += 3
            }
            if(x_delta > 6) {
                x_delta = 0
            }
            index++
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
    
    appendBox(box: HTMLElement) {
        let board = this.getBoard()
        board.appendChild(box)
    }

    render() {
        console.log('Rendering game board')
        let board = this.getBoard()
        this.container?.append(board)
        this.setDifficulty(null)
        this.generateBoard()
        this.first_click = true
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

    selectCell(cell: HTMLElement) {
        let current_selection = document.querySelector('.cell.selected') as HTMLElement
        if(current_selection) {
            current_selection.classList.remove('selected')
        }
        cell.classList.add('selected')
    }

    getSelectedCell(): HTMLElement|false {
        let current_selection = document.querySelector('.cell.selected') as HTMLElement
        if(current_selection) {
            return current_selection
        } else {
            return false
        }
    }

    moveSelectedCell(selected_cell: HTMLElement, direction: string) {
        console.log(selected_cell)
        console.log(direction)

        let next_cell

        let x = selected_cell.dataset.x ? parseInt(selected_cell.dataset.x) : 0
        let y = selected_cell.dataset.y ? parseInt(selected_cell.dataset.y) : 0
        switch(direction) {
            case 'right':
                y++
                if(y > 9) y = 1
                break
            case 'left':
                y--
                if(y < 1) y = 9
                break
            case 'up':
                x--
                if(x < 1) x = 9
                break
            case 'down':
                x++
                if(x > 9) x = 1
                break
        }

        next_cell = this.getCellByXY(x, y)
        if(next_cell) this.selectCell(next_cell)
    }

    addNumberToCell(cell: HTMLElement, number_to_add: number): void {
        if(cell.querySelector('p')) {
            let number_element = cell.querySelector('p') as HTMLElement
            number_element.innerHTML = number_to_add.toString()
            number_element.dataset.currentNumber = number_to_add.toString()
        } else {
            let number_element = document.createElement('p')
            number_element.classList.add('number')
            number_element.innerHTML = number_to_add.toString()
            number_element.dataset.currentNumber = number_to_add.toString()
    
            cell.appendChild(number_element)
        }
    }
    
    removeNumberFromCell(cell: HTMLElement): void {
        if(cell.querySelector('p')) {
            let number_element = cell.querySelector('p') as HTMLElement
            number_element.innerHTML = ''
            number_element.dataset.currentNumber = ''
        }
    }

    getKey(key: string): string|number|false {
        if(/^\d$/.test(key)) {
            return parseInt(key)
        }
        switch(key) {
            case 'q':
                return 1
            case 'w':
                return 2
            case 'e':
                return 3
            case 'a':
                return 4
            case 's':
                return 5
            case 'd':
                return 6
            case 'z':
                return 7
            case 'x':
                return 8
            case 'c':
                return 9
            case 'ArrowRight':
                return 'right'
            case 'ArrowLeft':
                return 'left'
            case 'ArrowDown':
                return 'down'
            case 'ArrowUp':
                return 'up'
            default:
                return false
        }
    }

    leftClick(clicked_cell: any): void {
        console.log('Left click')
        if(false) {
            this.winGame()
        }

        if(!clicked_cell) return
        if(clicked_cell.dataset.isChecked == '1') return

        let x = parseInt(clicked_cell.dataset.x)
        let y = parseInt(clicked_cell.dataset.y)

        this.selectCell(clicked_cell)
    }

    rightClick(cell: HTMLElement): void {
        console.log('Right click')
        if(cell.dataset.isChecked == '1') return
    }

    async firstClick(cell: HTMLElement) {
        console.log('first click!')

        await this.scanBoard()
        this.leftClick(cell)
    }

    loseGame() {
        alert('You lose!')
        this.resetBoard()
    }
    winGame() {
        alert('You Win!!')
        this.resetBoard()
    }

    initEventListeners() {
        let board = this.getBoard()

        window.addEventListener('keydown', (e) => {
            if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.key) > -1) {
                e.preventDefault()
            }
        });

        document.addEventListener('keyup', (e): void => {
            e.preventDefault()

            console.log(e.key)

            let key = this.getKey(e.key)
            if(!key) return

            let selected_cell = this.getSelectedCell() as HTMLElement
            if(!selected_cell) return
            // @ts-ignore
            let current_number = parseInt(selected_cell.dataset.currentNumber)
            if(current_number && current_number == key) {
                this.removeNumberFromCell(selected_cell)
            } else if(typeof key === 'number') {
                this.addNumberToCell(selected_cell, key)
            } else if(typeof key === 'string') {
                this.moveSelectedCell(selected_cell, key)
            }
        })

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
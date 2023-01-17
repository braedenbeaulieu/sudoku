import { GameBoard } from './gameBoard'

let preload_array = [{"x":"1","y":"1","val":"3"},{"x":"1","y":"4","val":"6"},{"x":"1","y":"5","val":"1"},{"x":"1","y":"9","val":"8"},{"x":"2","y":"3","val":"2"},{"x":"2","y":"5","val":"3"},{"x":"2","y":"7","val":"7"},{"x":"2","y":"8","val":"6"},{"x":"3","y":"4","val":"7"},{"x":"3","y":"5","val":"5"},{"x":"3","y":"7","val":"2"},{"x":"3","y":"8","val":"9"},{"x":"4","y":"2","val":"9"},{"x":"4","y":"4","val":"8"},{"x":"4","y":"8","val":"1"},{"x":"5","y":"2","val":"4"},{"x":"5","y":"4","val":"1"},{"x":"5","y":"5","val":"7"},{"x":"5","y":"6","val":"3"},{"x":"5","y":"8","val":"5"},{"x":"6","y":"2","val":"5"},{"x":"6","y":"6","val":"9"},{"x":"6","y":"8","val":"2"},{"x":"7","y":"2","val":"3"},{"x":"7","y":"3","val":"7"},{"x":"7","y":"5","val":"4"},{"x":"7","y":"6","val":"1"},{"x":"8","y":"2","val":"2"},{"x":"8","y":"3","val":"5"},{"x":"8","y":"5","val":"8"},{"x":"8","y":"7","val":"9"},{"x":"9","y":"1","val":"4"},{"x":"9","y":"6","val":"9"},{"x":"9","y":"7","val":"7"},{"x":"9","y":"9","val":"2"}]

export class Sudoku extends GameBoard {
    constructor(container: HTMLElement, rows: number, columns: number) {
        super(container, rows, columns)
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
                let x = i + x_delta
                let y = j + y_delta
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

    preloadBoard(preload_json: { x: string, y: string, val: string, }[]) {
        for(let element of preload_json) {
            let cell = document.querySelector(`[data-x="${element.x}"][data-y="${element.y}"]`) as HTMLElement
            if(!cell) continue

            this.addNumberToCell(cell, element.val)
            cell.dataset.isPreloaded = '1'
        }
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

        this.preloadBoard(preload_array)
    }

    togglePencilMode() {
        console.log('Toggle pencil mode')
        let board = document.querySelector('#board') as HTMLElement
        let is_in_pencil_mode = this.isInPencilMode()

        if(is_in_pencil_mode === '1') {
            board.dataset.pencilMode = '0'
        } else if(is_in_pencil_mode === '0') {
            board.dataset.pencilMode = '1'
        }
    }

    togglePencilModeOff() {
        let board = document.querySelector('#board') as HTMLElement
        board.dataset.pencilMode = '0'
    }
    
    isInPencilMode() {
        let board = document.querySelector('#board') as HTMLElement
        return board.dataset.pencilMode ? board.dataset.pencilMode : '0'
    }

    async resetBoard() {
        this.getBoard().innerHTML = ''
        this.setDifficulty(null)
        this.generateBoard()
        this.togglePencilModeOff()
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
        this.togglePencilModeOff()
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
        let current_selection = this.getSelectedCell()
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

    checkBox(cell: HTMLElement, key: number): boolean {
        let box = cell.parentElement as HTMLElement
        let cells_in_box = Array.from(box.querySelectorAll('.cell')) as HTMLElement[]
        
        
        // if the box already has that number
        for(let cell_in_box of cells_in_box) {
            let cell_in_box_number = this.getNumberFromCell(cell_in_box)
            if(cell_in_box_number == null) continue

            if(cell_in_box_number == key) return false
        }

        return true
    }

    checkHorizontalLine(cell: HTMLElement, key: number): boolean {
        let cells_in_horizontal_line = Array.from(document.querySelectorAll(`.cell[data-x="${cell.dataset.x}"]`)) as HTMLElement[]

        // if the line already has that number
        for(let cell_in_line of cells_in_horizontal_line) {
            let cell_in_line_number = this.getNumberFromCell(cell_in_line)
            if(cell_in_line_number == null) continue

            if(cell_in_line_number == key) return false
        }

        return true
    }

    checkVerticalLine(cell: HTMLElement, key: number): boolean {
        let cells_in_vertical_line = Array.from(document.querySelectorAll(`.cell[data-y="${cell.dataset.y}"]`)) as HTMLElement[]

        // if the line already has that number
        for(let cell_in_line of cells_in_vertical_line) {
            let cell_in_line_number = this.getNumberFromCell(cell_in_line)
            if(cell_in_line_number == null) continue

            if(cell_in_line_number == key) return false
        }

        return true
    }

    checkMove(cell: HTMLElement, key: number): boolean {
        if(!this.checkBox(cell, key)) return false
        if(!this.checkHorizontalLine(cell, key)) return false
        if(!this.checkVerticalLine(cell, key)) return false
        
        return true
    }

    addPencilNumberToCell(cell: HTMLElement, number_to_add: string): void {
        if(cell.dataset.isPreloaded == '1') return

        let pencil_digits = cell.dataset.pencilDigits?.split(',')
        pencil_digits = typeof pencil_digits == 'undefined' ? [] : pencil_digits

        console.log('pencil_digits 1', pencil_digits)
        console.log('pencil_digits.indexOf(number_to_add)', pencil_digits.indexOf(number_to_add))
        if(pencil_digits.indexOf(number_to_add) >= 0) {
            this.removePencilNumberFromCell(cell, number_to_add)
            return
        }

        let sanitized_pencil_digits: string[] = []
        for(let digit of pencil_digits) {
            if(typeof digit != 'undefined' && parseInt(digit) >= 1 && parseInt(digit) <= 9) {
                sanitized_pencil_digits.push(digit)
            }
        
        }
        sanitized_pencil_digits.push(number_to_add)

        sanitized_pencil_digits = sanitized_pencil_digits.sort((a: string, b: string) => parseInt(a) - parseInt(b))

        let number_element = document.createElement('small')
        number_element.classList.add('number')
        number_element.innerHTML = number_to_add

        console.log(number_element)
    
        cell.dataset.pencilDigits = sanitized_pencil_digits.join(',')
        cell.appendChild(number_element)

        return
    }

    addNumberToCell(cell: HTMLElement, number_to_add: string): void {
        if(cell.dataset.isPreloaded == '1') return

        if(cell.querySelector('small')) {
            cell.removeChild(cell.firstChild as HTMLElement)
        }

        if(cell.querySelector('p')) {
            let number_element = cell.querySelector('p') as HTMLElement
            number_element.innerHTML = number_to_add
            cell.dataset.currentNumber = number_to_add
        } else {
            let number_element = document.createElement('p')
            number_element.classList.add('number')
            number_element.innerHTML = number_to_add
            cell.dataset.currentNumber = number_to_add
    
            cell.appendChild(number_element)
        }
    }
    
    removePencilNumberFromCell(cell: HTMLElement, number_to_remove: string): void {
        console.log('Removing pencil number', number_to_remove)
        if(cell.dataset.isPreloaded == '1') return
        let pencil_digits = cell.dataset.pencilDigits?.split(',')
        pencil_digits = typeof pencil_digits == 'undefined' ? [] : pencil_digits
        // @ts-ignore
        if(pencil_digits?.indexOf(number_to_remove) < 0) return

        pencil_digits.splice(pencil_digits?.indexOf(number_to_remove), 1)

        console.log('pencil_digits [] ', pencil_digits)
        
        cell.dataset.pencilDigits = ''
        cell.dataset.currentNumber = ''
        cell.innerHTML = ''
        for(let digit of pencil_digits) {
            this.addPencilNumberToCell(cell, digit)
        }

    }

    removeNumberFromCell(cell: HTMLElement): void {
        if(cell.dataset.isPreloaded == '1') return
        if(cell.querySelector('p')) {
            let number_element = cell.querySelector('p') as HTMLElement
            number_element.innerHTML = ''
            cell.dataset.currentNumber = ''
        }
    }
    
    getNumberFromCell(cell: HTMLElement): number|null {
        if(cell.querySelector('p')) {
            let number_element = cell.querySelector('p') as HTMLElement
            return parseInt(number_element.innerHTML)
        }

        return null
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
            case 'Backspace':
                return 'remove'
            case 'Enter':
                return 'pencil'
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
        // console.log('Left click')

        if(!clicked_cell) return
        if(clicked_cell.dataset.isChecked == '1') return

        // let x = parseInt(clicked_cell.dataset.x)
        // let y = parseInt(clicked_cell.dataset.y)

        this.selectCell(clicked_cell)
    }

    rightClick(cell: HTMLElement): void {
        console.log('Right click')
        if(cell.dataset.isChecked == '1') return
    }

    async firstClick(cell: HTMLElement) {
        console.log('Rirst click')

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
        })

        document.addEventListener('keydown', (e): void => {
            e.preventDefault()

            let key = this.getKey(e.key)
            if(!key) return

            let selected_cell = this.getSelectedCell() as HTMLElement
            if(!selected_cell) return
            
            let current_number = selected_cell.dataset.currentNumber ? parseInt(selected_cell.dataset.currentNumber) : false
            if((current_number && current_number == key) || key == 'remove') {
                selected_cell.classList.remove('error')
                this.removeNumberFromCell(selected_cell)
                this.removePencilNumberFromCell(selected_cell, current_number.toString())
            } else if(typeof key === 'number') {
                let move_status = this.checkMove(selected_cell, key)
                if(move_status == false && selected_cell.dataset.isPreloaded != '1') {
                    selected_cell.classList.add('error')
                }
                this.isInPencilMode() == '1' ? this.addPencilNumberToCell(selected_cell, key.toString()) : this.addNumberToCell(selected_cell, key.toString())
            } else if(typeof key === 'string') {
                if(key == 'pencil') {
                    this.togglePencilMode()
                    document.querySelector('.pencil-toggle')?.classList.toggle('enabled')
                } else if(['right', 'left', 'up', 'down'].indexOf(key) >= -1) {
                    // let error_cell = document.querySelector('.cell.error') as HTMLElement
                    // if(error_cell) error_cell.classList.remove('error')

                    this.moveSelectedCell(selected_cell, key)
                }
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

        document.querySelector('.pencil-toggle')?.addEventListener('click', () => {
            this.togglePencilMode()            
            document.querySelector('.pencil-toggle')?.classList.toggle('enabled')
        })
    }
}
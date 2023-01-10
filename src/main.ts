import './style.css'
import { Sudoku } from './sudoku'

let container = document.getElementById('app') as HTMLElement
let board = new Sudoku(container, 9, 9)
board.render()
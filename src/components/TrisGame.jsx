import { useState, useCallback, useRef } from 'react'
import { t as translate } from '../i18n/index.js';

const DOGE_URL = import.meta.env.PUBLIC_SUFFERINGDOGE_URL || '';

function generateWinLines(rows, cols, winLen) {
  const lines = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + winLen <= cols) {
        lines.push(Array.from({ length: winLen }, (_, k) => r * cols + c + k))
      }
      if (r + winLen <= rows) {
        lines.push(Array.from({ length: winLen }, (_, k) => (r + k) * cols + c))
      }
      if (r + winLen <= rows && c + winLen <= cols) {
        lines.push(Array.from({ length: winLen }, (_, k) => (r + k) * cols + c + k))
      }
      if (r + winLen <= rows && c - winLen + 1 >= 0) {
        lines.push(Array.from({ length: winLen }, (_, k) => (r + k) * cols + c - k))
      }
    }
  }
  return lines
}

function checkWinner(board, winLines) {
  for (const line of winLines) {
    const first = board[line[0]]
    if (first && line.every((i) => board[i] === first)) {
      return { winner: first, line }
    }
  }
  if (board.every((cell) => cell)) return { winner: 'draw', line: null }
  return { winner: null, line: null }
}

export default function TrisGame({ lang }) {
  const t = (key) => translate(lang, key);
  const [config, setConfig] = useState({ rows: 3, cols: 3, winLen: 3, playerSymbol: 'X' })
  const [configInput, setConfigInput] = useState({ rows: '3', cols: '3', winLen: '3', playerSymbol: 'X' })
  const [started, setStarted] = useState(false)
  const [board, setBoard] = useState(null)
  const [winLines, setWinLines] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState(null)
  const [winLine, setWinLine] = useState(null)
  const [thinking, setThinking] = useState(false)
  const boardRef = useRef(null)

  const fetchAiMove = useCallback(async (currentBoard, lastMove, cfg) => {
    const res = await fetch(`${DOGE_URL}/api/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board: currentBoard,
        lastMove,
        rows: cfg.rows,
        cols: cfg.cols,
        winLen: cfg.winLen,
        aiFirst: cfg.playerSymbol === 'O',
      }),
    })
    return res.json()
  }, [])

  const applyAiMove = useCallback((currentBoard, move, wl, aiSym) => {
    const aiIndex = move[0] * config.cols + move[1]
    const aiBoard = [...currentBoard]
    aiBoard[aiIndex] = aiSym
    setBoard(aiBoard)

    const afterAi = checkWinner(aiBoard, wl)
    if (afterAi.winner) {
      setGameOver(true)
      setResult(afterAi.winner)
      setWinLine(afterAi.line)
    }
    return aiBoard
  }, [config.cols])

  const startGame = useCallback(async () => {
    const rows = Math.max(3, Math.min(10, parseInt(configInput.rows) || 3))
    const cols = Math.max(3, Math.min(10, parseInt(configInput.cols) || 3))
    const winLen = Math.max(3, Math.min(Math.max(rows, cols), parseInt(configInput.winLen) || 3))
    const playerSymbol = configInput.playerSymbol
    const cfg = { rows, cols, winLen, playerSymbol }
    setConfig(cfg)
    setConfigInput({ rows: String(rows), cols: String(cols), winLen: String(winLen), playerSymbol })

    const wl = generateWinLines(rows, cols, winLen)
    setWinLines(wl)
    const emptyBoard = Array(rows * cols).fill('')
    setBoard(emptyBoard)
    setGameOver(false)
    setResult(null)
    setWinLine(null)
    setStarted(true)
    setTimeout(() => {
      boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)

    if (playerSymbol === 'O') {
      setThinking(true)
      try {
        const data = await fetchAiMove(emptyBoard, null, cfg)
        if (data.move) {
          const aiIndex = data.move[0] * cols + data.move[1]
          const aiBoard = [...emptyBoard]
          aiBoard[aiIndex] = 'X'
          setBoard(aiBoard)
        }
      } catch { /* backend unreachable */ }
      setThinking(false)
    }
  }, [configInput, fetchAiMove])

  const reset = useCallback(async () => {
    const emptyBoard = Array(config.rows * config.cols).fill('')
    setBoard(emptyBoard)
    setGameOver(false)
    setResult(null)
    setWinLine(null)

    if (config.playerSymbol === 'O') {
      setThinking(true)
      try {
        const data = await fetchAiMove(emptyBoard, null, config)
        if (data.move) {
          const aiIndex = data.move[0] * config.cols + data.move[1]
          const aiBoard = [...emptyBoard]
          aiBoard[aiIndex] = 'X'
          setBoard(aiBoard)
        }
      } catch { /* backend unreachable */ }
      setThinking(false)
    } else {
      setThinking(false)
    }
  }, [config, fetchAiMove])

  const backToConfig = useCallback(() => {
    setStarted(false)
    setBoard(null)
    setGameOver(false)
    setResult(null)
    setWinLine(null)
    setThinking(false)
  }, [])

  const handleClick = useCallback(async (index) => {
    if (!board || board[index] || gameOver || thinking) return

    const row = Math.floor(index / config.cols)
    const col = index % config.cols
    const playerSym = config.playerSymbol
    const aiSym = playerSym === 'X' ? 'O' : 'X'

    const newBoard = [...board]
    newBoard[index] = playerSym
    setBoard(newBoard)

    const afterPlayer = checkWinner(newBoard, winLines)
    if (afterPlayer.winner) {
      setGameOver(true)
      setResult(afterPlayer.winner)
      setWinLine(afterPlayer.line)
      return
    }

    setThinking(true)
    try {
      const data = await fetchAiMove(newBoard, [row, col], config)
      if (data.move) {
        applyAiMove(newBoard, data.move, winLines, aiSym)
      }
    } catch {
      setBoard(board)
    }
    setThinking(false)
  }, [board, gameOver, thinking, winLines, config, fetchAiMove, applyAiMove])

  const getStatusText = () => {
    if (thinking) return t('trisGame.thinking')
    if (result === config.playerSymbol) return t('trisGame.youWon')
    if (result === 'draw') return t('trisGame.draw')
    if (result) return t('trisGame.aiWins')
    return t('trisGame.yourTurn').replace('{symbol}', config.playerSymbol)
  }

  if (!started) {
    return (
      <div className="tris-game">
        <div className="tris-config">
          <h4 className="tris-config-title">{t('trisGame.boardConfig')}</h4>
          <div className="tris-config-fields">
            <label className="tris-config-field">
              <span>{t('trisGame.rows')}</span>
              <input
                type="number"
                min="3"
                max="10"
                value={configInput.rows}
                onChange={(e) => setConfigInput((c) => ({ ...c, rows: e.target.value }))}
              />
            </label>
            <label className="tris-config-field">
              <span>{t('trisGame.columns')}</span>
              <input
                type="number"
                min="3"
                max="10"
                value={configInput.cols}
                onChange={(e) => setConfigInput((c) => ({ ...c, cols: e.target.value }))}
              />
            </label>
            <label className="tris-config-field">
              <span>{t('trisGame.winLength')}</span>
              <input
                type="number"
                min="3"
                max="10"
                value={configInput.winLen}
                onChange={(e) => setConfigInput((c) => ({ ...c, winLen: e.target.value }))}
              />
            </label>
            <label className="tris-config-field">
              <span>{t('trisGame.playAs')}</span>
              <select
                value={configInput.playerSymbol}
                onChange={(e) => setConfigInput((c) => ({ ...c, playerSymbol: e.target.value }))}
              >
                <option value="X">X</option>
                <option value="O">O</option>
              </select>
            </label>
          </div>
          <p className="tris-config-hint">{t('trisGame.classicHint')}</p>
          <button className="tris-reset" onClick={startGame}>
            {t('trisGame.startGame')}
          </button>
        </div>
      </div>
    )
  }

  const cellSize = config.cols <= 5 ? 80 : config.cols <= 7 ? 60 : 46
  const fontSize = config.cols <= 5 ? '2rem' : config.cols <= 7 ? '1.4rem' : '1rem'
  const boardWidth = config.cols * cellSize + (config.cols - 1) * 6

  return (
    <div ref={boardRef} className="tris-game">
      <div className="tris-status">
        <span className={`tris-status-text ${result ? 'tris-' + result : ''}`}>
          {thinking && <span className="spinner" />}
          {getStatusText()}
        </span>
        <span className="tris-config-label">
          {config.rows}x{config.cols}, {config.winLen} {t('trisGame.toWin')}
        </span>
      </div>
      <div
        className="tris-board"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${config.rows}, ${cellSize}px)`,
          width: boardWidth,
        }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            className={`tris-cell${winLine?.includes(i) ? ' tris-win' : ''}${cell === 'X' ? ' tris-x' : ''}${cell === 'O' ? ' tris-o' : ''}`}
            style={{ fontSize }}
            onClick={() => handleClick(i)}
            disabled={!!cell || gameOver || thinking}
          >
            {cell || '\u00A0'}
          </button>
        ))}
      </div>
      <div className="tris-actions">
        <button className="tris-reset" onClick={reset}>
          {t('trisGame.newGame')}
        </button>
        <button className="tris-reset tris-back" onClick={backToConfig}>
          {t('trisGame.changeBoard')}
        </button>
      </div>
    </div>
  )
}

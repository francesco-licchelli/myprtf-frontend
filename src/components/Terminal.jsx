import { useRef, useEffect } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

function scrollToSection(id) {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 300)
}

const GREEN = '\x1b[32m'
const CYAN = '\x1b[36m'
const MAGENTA = '\x1b[35m'
const RESET = '\x1b[0m'
const PROMPT = `${GREEN}francesco@portfolio:~$${RESET} `

const SECTION_COMMANDS = {
  about: {
    section: 'about',
    output: `${MAGENTA}Francesco Licchelli${RESET}\r\nSoftware Developer | Java | Python | Full-Stack`,
  },
  projects: {
    section: 'projects',
    output: `Loading ${MAGENTA}6${RESET} projects...\r\n  - Squealer (Node.js, React, Vue, MongoDB)\r\n  - ChessVerse (React, Django, Docker, Azure)\r\n  - Panda+ (C, UNIX Kernel)\r\n  - SufferingDoge (Java, MiniMax AI)\r\n  - YCILT (Kotlin, Jetpack Compose)\r\n  - JolieGraph (Java, Jolie)`,
  },
  skills: {
    section: 'skills',
    output: `Tech Stack:\r\n\r\n  ${MAGENTA}Backend${RESET}:      Java, Spring Boot, Python, Django\r\n  ${MAGENTA}Frontend${RESET}:     React, Vue.js, HTML/CSS, JS\r\n  ${MAGENTA}Sys & DevOps${RESET}: GNU/Linux (Debian), Bash, Docker, Ansible\r\n  ${MAGENTA}Tools${RESET}:        Git, MongoDB, C, Kotlin`,
  },
  contact: {
    section: 'contact',
    output: `Let's connect!\r\n\r\n  Email:    francesco.licchelli@example.com\r\n  GitHub:   github.com/francescolicchelli\r\n  LinkedIn: linkedin.com/in/francescolicchelli`,
  },
}

const ALL_COMMANDS = ['about', 'projects', 'skills', 'contact', 'clear', 'help']

const HELP_TEXT = `Available commands:\r\n  ${CYAN}about${RESET}      - Who I am\r\n  ${CYAN}projects${RESET}   - My projects\r\n  ${CYAN}skills${RESET}     - Tech stack\r\n  ${CYAN}contact${RESET}    - Get in touch\r\n  ${CYAN}clear${RESET}      - Clear terminal\r\n  ${CYAN}help${RESET}       - Show this help`

export default function Terminal() {
  const termRef = useRef(null)
  const xtermRef = useRef(null)

  useEffect(() => {
    if (xtermRef.current) return

    const term = new XTerm({
      theme: {
        background: '#0d0d14',
        foreground: '#a1a1aa',
        cursor: '#e4e4e7',
        cursorAccent: '#0d0d14',
        green: '#4ade80',
        cyan: '#06b6d4',
        magenta: '#7c3aed',
        brightGreen: '#4ade80',
        brightCyan: '#06b6d4',
        brightMagenta: '#7c3aed',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'underline',
      scrollback: 1000,
      convertEol: true,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(termRef.current)
    fitAddon.fit()
    xtermRef.current = term

    let inputBuffer = ''
    let pendingScroll = null
    let ready = false
    const history = []
    let historyIndex = -1
    let savedInput = ''

    function clearInput() {
      while (inputBuffer.length > 0) {
        term.write('\b \b')
        inputBuffer = inputBuffer.slice(0, -1)
      }
    }

    function writeInput(text) {
      clearInput()
      inputBuffer = text
      term.write(text)
    }

    function writePrompt() {
      if (pendingScroll) {
        term.write(`Navigate to ${CYAN}${pendingScroll}${RESET} section? ${MAGENTA}[Y/n]${RESET}: `)
      } else {
        term.write(PROMPT)
      }
    }

    function handleCommand(cmd) {
      if (cmd && !pendingScroll) {
        history.push(cmd)
      }
      historyIndex = -1
      savedInput = ''

      if (pendingScroll) {
        if (cmd === 'y' || cmd === 'yes' || cmd === '') {
          term.writeln(`Scrolling to ${CYAN}${pendingScroll.charAt(0).toUpperCase() + pendingScroll.slice(1)}${RESET} section...`)
          scrollToSection(pendingScroll)
          pendingScroll = null
        } else if (cmd === 'n' || cmd === 'no') {
          pendingScroll = null
        } else {
          term.writeln(`Please answer ${MAGENTA}y${RESET} or ${MAGENTA}n${RESET}`)
        }
        writePrompt()
        return
      }

      if (SECTION_COMMANDS[cmd]) {
        const { section, output } = SECTION_COMMANDS[cmd]
        term.writeln(output)
        term.writeln('')
        pendingScroll = section
        writePrompt()
        return
      }

      if (cmd === 'help') {
        term.writeln(HELP_TEXT)
        writePrompt()
        return
      }

      if (cmd === 'clear') {
        term.clear()
        writePrompt()
        return
      }

      if (cmd === '') {
        writePrompt()
        return
      }

      term.writeln(`Command not found: ${MAGENTA}${cmd}${RESET}. Type ${CYAN}help${RESET} for available commands.`)
      writePrompt()
    }

    // Intro sequence
    const introLines = [
      'Welcome to my portfolio terminal!',
      `I'm ${MAGENTA}Francesco Licchelli${RESET}, a Software Developer.`,
      `Type ${CYAN}help${RESET} to explore.`,
    ]

    introLines.forEach((line, i) => {
      setTimeout(() => {
        term.writeln(line)
        if (i === introLines.length - 1) {
          setTimeout(() => {
            term.write('\r\n' + PROMPT)
            ready = true
          }, 100)
        }
      }, 500 + i * 150)
    })

    term.onData((data) => {
      if (!ready) return

      // Enter
      if (data === '\r') {
        term.write('\r\n')
        handleCommand(inputBuffer.trim().toLowerCase())
        inputBuffer = ''
        return
      }

      // Backspace
      if (data === '\x7f' || data === '\b') {
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1)
          term.write('\b \b')
        }
        return
      }

      // Tab completion
      if (data === '\t') {
        if (pendingScroll) return
        const partial = inputBuffer.trim().toLowerCase()
        if (!partial) return
        const matches = ALL_COMMANDS.filter((c) => c.startsWith(partial))
        if (matches.length === 1) {
          writeInput(matches[0])
        } else if (matches.length > 1) {
          term.write('\r\n' + matches.join('  ') + '\r\n')
          writePrompt()
          term.write(inputBuffer)
        }
        return
      }

      // Arrow up
      if (data === '\x1b[A') {
        if (history.length === 0) return
        if (historyIndex === -1) {
          savedInput = inputBuffer
          historyIndex = history.length - 1
        } else if (historyIndex > 0) {
          historyIndex--
        }
        writeInput(history[historyIndex])
        return
      }

      // Arrow down
      if (data === '\x1b[B') {
        if (historyIndex === -1) return
        if (historyIndex < history.length - 1) {
          historyIndex++
          writeInput(history[historyIndex])
        } else {
          historyIndex = -1
          writeInput(savedInput)
        }
        return
      }

      // Printable characters
      if (data >= ' ' && data.length === 1) {
        inputBuffer += data
        term.write(data)
      }
    })

    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
      xtermRef.current = null
    }
  }, [])

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="terminal-title">francesco@portfolio:~</span>
      </div>
      <div className="terminal-body" ref={termRef} />
    </div>
  )
}

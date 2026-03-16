import { useRef, useEffect } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import contacts from '../data/contacts'
import { t as translate } from '../i18n/index.js'

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

function link(url, label) {
  return `\x1b]8;;${url}\x07${CYAN}${label}${RESET}\x1b]8;;\x07`
}

const ALL_COMMANDS = ['about', 'projects', 'skills', 'contact', 'clear', 'help']

export default function Terminal({ lang }) {
  const termRef = useRef(null)
  const xtermRef = useRef(null)

  useEffect(() => {
    if (xtermRef.current) return

    const t = (key) => translate(lang, key);

    // Build translated outputs with ANSI colors
    const aboutOut = t('terminal.aboutOutput').replace(/^(.+)/, `${MAGENTA}$1${RESET}`)
    const projectsOut = t('terminal.projectsOutput').replace(/(\d+)/, `${MAGENTA}$1${RESET}`)
    const skillsOut = t('terminal.skillsOutput')
      .replace(/(Backend|Frontend|Sys & DevOps|Tools)/g, `${MAGENTA}$1${RESET}`)
    const contactOut = t('terminal.contactOutput')
      .replace('{email}', link(`mailto:${contacts.email}`, contacts.email))
      .replace('{github}', link(contacts.github.url, contacts.github.label))
      .replace('{linkedin}', link(contacts.linkedin.url, contacts.linkedin.label))

    const sectionCommands = {
      about: { section: 'about', output: aboutOut },
      projects: { section: 'projects', output: projectsOut },
      skills: { section: 'skills', output: skillsOut },
      contact: { section: 'contact', output: contactOut },
    }

    let helpText = t('terminal.helpText')
    ALL_COMMANDS.forEach((cmd) => {
      helpText = helpText.replace(cmd, `${CYAN}${cmd}${RESET}`)
    })

    const darkTheme = {
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
    }
    const lightTheme = {
      background: '#f8f8fc',
      foreground: '#3f3f46',
      cursor: '#18181b',
      cursorAccent: '#f8f8fc',
      green: '#16a34a',
      cyan: '#0891b2',
      magenta: '#7c3aed',
      brightGreen: '#16a34a',
      brightCyan: '#0891b2',
      brightMagenta: '#7c3aed',
    }

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const term = new XTerm({
      theme: isLight() ? lightTheme : darkTheme,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'underline',
      scrollback: 1000,
      convertEol: true,
      allowProposedApi: true,
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
        term.write(
          t('terminal.navigatePrompt').replace('{section}', `${CYAN}${pendingScroll}${RESET}`)
          + ` ${MAGENTA}[Y/n]${RESET}: `
        )
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
          const capitalized = pendingScroll.charAt(0).toUpperCase() + pendingScroll.slice(1)
          term.writeln(
            t('terminal.scrollingTo').replace('{section}', `${CYAN}${capitalized}${RESET}`)
          )
          scrollToSection(pendingScroll)
          pendingScroll = null
        } else if (cmd === 'n' || cmd === 'no') {
          pendingScroll = null
        } else {
          term.writeln(
            t('terminal.answerYN')
              .replace(/ y /, ` ${MAGENTA}y${RESET} `)
              .replace(/ n$/, ` ${MAGENTA}n${RESET}`)
          )
        }
        writePrompt()
        return
      }

      if (sectionCommands[cmd]) {
        const { section, output } = sectionCommands[cmd]
        term.writeln(output)
        term.writeln('')
        pendingScroll = section
        writePrompt()
        return
      }

      if (cmd === 'help') {
        term.writeln(helpText)
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

      const helpCmd = t('terminal.helpCommand')
      term.writeln(
        t('terminal.commandNotFound')
          .replace('{cmd}', `${MAGENTA}${cmd}${RESET}`)
          .replace(helpCmd, `${CYAN}${helpCmd}${RESET}`)
      )
      writePrompt()
    }

    // Intro sequence
    const introLines = [
      t('terminal.welcome'),
      t('terminal.intro').replace('Francesco Licchelli', `${MAGENTA}Francesco Licchelli${RESET}`),
      t('terminal.helpHint').replace(
        t('terminal.helpCommand'),
        `${CYAN}${t('terminal.helpCommand')}${RESET}`
      ),
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

    const observer = new MutationObserver(() => {
      term.options.theme = isLight() ? lightTheme : darkTheme
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      term.dispose()
      xtermRef.current = null
    }
  }, [lang])

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

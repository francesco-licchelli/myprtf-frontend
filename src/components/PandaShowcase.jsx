
const layers = [
  { level: 6, en: 'Interactive Shell', it: 'Shell interattiva', dim: true },
  { level: 5, en: 'File System', it: 'File-system', dim: true },
  { level: 4, en: 'Support Level', it: 'Livello di supporto', dim: true },
  { level: 3, en: 'OS Kernel', it: 'Kernel del S.O.', phase: 2 },
  { level: 2, en: 'Queue Management', it: 'Gestione delle Code', phase: 1 },
  { level: 1, en: 'ROM Services', it: 'Servizi offerti dalla ROM', hw: true },
  { level: 0, en: 'uMPS3 Hardware', it: 'Hardware di uMPS3', hw: true },
]

const sections = {
  en: [
    {
      title: 'Layered architecture',
      text: 'Panda+ follows Dijkstra\'s THE model with 6 abstraction layers. The project implements Levels 2 and 3: the data structures that the kernel relies on, and the kernel itself. The lower layers (0-1) are provided by the uMPS3 hardware emulator, while the upper layers (4-6) would extend the OS with support structures, a file system, and an interactive shell.',
      type: 'layers',
    },
    {
      title: 'Phase 1 — Data structures',
      text: 'Level 2 provides the foundational data structures used by the kernel: Process Control Blocks (PCB) organized in free lists, process queues, and process trees with parent-child-sibling relationships. Semaphore descriptors (SEMD) are managed via a hash table for O(1) lookup. Namespaces provide process isolation by grouping related processes.',
      type: 'code',
      code: `typedef struct pcb_t {
  struct list_head p_list;       /* process queue  */

  struct pcb_t *p_parent;        /* ptr to parent  */
  struct list_head p_child;      /* children list  */
  struct list_head p_sib;        /* sibling list   */

  state_t p_s;                   /* processor state */
  cpu_t p_time;                  /* cpu time used   */
  int *p_semAdd;                 /* blocked on sem  */
  support_t *p_supportStruct;
  nsd_t *namespaces[NS_TYPE_MAX];
  pid_t p_pid;
} pcb_t;`,
      file: 'pandos_types.h',
    },
    {
      title: 'Phase 2 — System initialization',
      text: 'The kernel boots from main(): it sets up the Pass Up Vector for exception/TLB-Refill handling, initializes the Phase 1 data structures (PCBs, semaphores, namespaces), configures the Interval Timer to 100ms, allocates the first process in kernel mode with interrupts enabled, and finally invokes the scheduler.',
      type: 'code',
      code: `void main() {
  passupvector->tlb_refill_handler = uTLB_RefillHandler;
  passupvector->exception_handler  = exceptionHandler;
  initPcbs();  initASH();  initNamespaces();
  mkEmptyProcQ(&readyQueue);
  LDIT(PSECOND);  /* interval timer = 100ms */

  pcb_PTR init = allocPcb();
  init->p_s.status = ALLOFF | IMON | IEPON | TEBITON;
  init->p_s.pc_epc = (unsigned int)test;
  RAMTOP(init->p_s.reg_sp);
  insertProcQ(&readyQueue, init);
  scheduler();
}`,
      file: 'initial.c',
    },
    {
      title: 'Round-Robin scheduler',
      text: 'The scheduler implements a preemptive round-robin policy with time slices. It dequeues the next ready process, arms the Processor Local Timer, and loads the process state into the CPU. If no processes exist, the system halts. If processes are alive but all blocked with none on device semaphores, it\'s a deadlock — PANIC. Otherwise, interrupts are enabled and the CPU waits for a device to unblock a process.',
      type: 'code',
      code: `void scheduler() {
  currentProcess = removeProcQ(&readyQueue);
  if (currentProcess != NULL) {
    setTIMER(TIMESLICE * TIMESCALE);
    LDST(&currentProcess->p_s);
  }
  else if (processCount == 0)  HALT();
  else if (softBlockedCount == 0)  PANIC();
  else {
    setSTATUS(getSTATUS() | IECON | IMON);
    WAIT();
  }
}`,
      file: 'scheduler.c',
    },
    {
      title: 'Exception handling',
      text: 'When an exception occurs, uMPS3 saves the processor state and jumps to the exception handler. The handler reads the Cause register to dispatch to the appropriate routine: interrupt handler, TLB exception (pass-up or die), syscall handler, or general exception. Syscalls are only allowed from kernel mode — a user-mode syscall triggers a Reserved Instruction exception.',
      type: 'code',
      code: `void exceptionHandler() {
  switch (CAUSE_GET_EXCCODE(getCAUSE())) {
    case EXC_INT:                  /* Interrupt */
      interruptHandler();  break;
    case EXC_MOD: case EXC_TLBL: case EXC_TLBS:
      passUpOrDieHandler(PGFAULTEXCEPT);  break;
    case EXC_SYS:                  /* Syscall */
      systemcallHandler();  break;
    default:
      passUpOrDieHandler(GENERALEXCEPT);
  }
}`,
      file: 'exceptions.c',
    },
    {
      title: 'Syscalls & semaphores',
      text: 'The kernel exposes 10 syscalls: process creation/termination, Passeren (P) and Verhogen (V) on binary semaphores, device I/O, CPU time accounting, clock wait, support struct access, PID retrieval, and child enumeration. Semaphores coordinate access to shared resources — a process calling P on a zero semaphore is blocked and rescheduled; V unblocks a waiting process or sets the semaphore to 1.',
      type: 'code',
      code: `/* Syscall dispatch (reg_a0) */
case CREATEPROCESS:  createProcess(...);
case TERMPROCESS:    termProcess(pid);
case PASSEREN:       passeren(sem);   /* P() */
case VERHOGEN:       verhogen(sem);   /* V() */
case DOIO:           doIO(cmdAddr, cmdVal);
case GETTIME:        getTime();
case CLOCKWAIT:      clockWait();
case GETSUPPORTPTR:  getSupportPtr();
case GETPROCESSID:   getProcessId(parent);
case GETCHILDREN:    getChildren(buf, size);`,
      file: 'exceptions.c',
    },
  ],
  it: [
    {
      title: 'Architettura a livelli',
      text: 'Panda+ segue il modello THE di Dijkstra con 6 livelli di astrazione. Il progetto implementa i Livelli 2 e 3: le strutture dati su cui il kernel si basa, e il kernel stesso. I livelli inferiori (0-1) sono forniti dall\'emulatore hardware uMPS3, mentre i livelli superiori (4-6) estenderebbero il S.O. con strutture di supporto, file system e shell interattiva.',
      type: 'layers',
    },
    {
      title: 'Fase 1 — Strutture dati',
      text: 'Il Livello 2 fornisce le strutture dati fondamentali usate dal kernel: i Process Control Block (PCB) organizzati in free list, code di processi e alberi di processi con relazioni padre-figlio-fratello. I descrittori dei semafori (SEMD) sono gestiti tramite hash table per lookup O(1). I namespace forniscono isolamento tra processi raggruppando processi correlati.',
      type: 'code',
      code: `typedef struct pcb_t {
  struct list_head p_list;       /* process queue  */

  struct pcb_t *p_parent;        /* ptr to parent  */
  struct list_head p_child;      /* children list  */
  struct list_head p_sib;        /* sibling list   */

  state_t p_s;                   /* processor state */
  cpu_t p_time;                  /* cpu time used   */
  int *p_semAdd;                 /* blocked on sem  */
  support_t *p_supportStruct;
  nsd_t *namespaces[NS_TYPE_MAX];
  pid_t p_pid;
} pcb_t;`,
      file: 'pandos_types.h',
    },
    {
      title: 'Fase 2 — Inizializzazione del sistema',
      text: "Il kernel parte da main(): configura il Pass Up Vector per la gestione delle eccezioni e del TLB-Refill, inizializza le strutture dati della Fase 1 (PCB, semafori, namespace), imposta l'Interval Timer a 100ms, alloca il primo processo in kernel mode con interrupt abilitati, e infine invoca lo scheduler.",
      type: 'code',
      code: `void main() {
  passupvector->tlb_refill_handler = uTLB_RefillHandler;
  passupvector->exception_handler  = exceptionHandler;
  initPcbs();  initASH();  initNamespaces();
  mkEmptyProcQ(&readyQueue);
  LDIT(PSECOND);  /* interval timer = 100ms */

  pcb_PTR init = allocPcb();
  init->p_s.status = ALLOFF | IMON | IEPON | TEBITON;
  init->p_s.pc_epc = (unsigned int)test;
  RAMTOP(init->p_s.reg_sp);
  insertProcQ(&readyQueue, init);
  scheduler();
}`,
      file: 'initial.c',
    },
    {
      title: 'Scheduler Round-Robin',
      text: "Lo scheduler implementa una politica round-robin preemptive con time slice. Estrae il prossimo processo dalla ready queue, arma il Processor Local Timer e carica lo stato del processo nella CPU. Se non esistono processi, il sistema si ferma. Se i processi sono tutti bloccati senza nessuno su semafori di device, e' un deadlock — PANIC. Altrimenti, abilita gli interrupt e la CPU attende che un device sblocchi un processo.",
      type: 'code',
      code: `void scheduler() {
  currentProcess = removeProcQ(&readyQueue);
  if (currentProcess != NULL) {
    setTIMER(TIMESLICE * TIMESCALE);
    LDST(&currentProcess->p_s);
  }
  else if (processCount == 0)  HALT();
  else if (softBlockedCount == 0)  PANIC();
  else {
    setSTATUS(getSTATUS() | IECON | IMON);
    WAIT();
  }
}`,
      file: 'scheduler.c',
    },
    {
      title: 'Gestione delle eccezioni',
      text: "Quando si verifica un'eccezione, uMPS3 salva lo stato del processore e salta all'exception handler. Il gestore legge il registro Cause per indirizzare alla routine appropriata: gestore degli interrupt, eccezione TLB (pass-up or die), gestore delle syscall, o eccezione generica. Le syscall sono permesse solo da kernel mode — una syscall da user mode genera un'eccezione Reserved Instruction.",
      type: 'code',
      code: `void exceptionHandler() {
  switch (CAUSE_GET_EXCCODE(getCAUSE())) {
    case EXC_INT:                  /* Interrupt */
      interruptHandler();  break;
    case EXC_MOD: case EXC_TLBL: case EXC_TLBS:
      passUpOrDieHandler(PGFAULTEXCEPT);  break;
    case EXC_SYS:                  /* Syscall */
      systemcallHandler();  break;
    default:
      passUpOrDieHandler(GENERALEXCEPT);
  }
}`,
      file: 'exceptions.c',
    },
    {
      title: 'Syscall e semafori',
      text: "Il kernel espone 10 syscall: creazione/terminazione processi, Passeren (P) e Verhogen (V) su semafori binari, I/O su device, conteggio tempo CPU, attesa clock, accesso alla struttura di supporto, recupero PID ed enumerazione dei figli. I semafori coordinano l'accesso a risorse condivise — un processo che chiama P su un semaforo a zero viene bloccato e rischedulato; V sblocca un processo in attesa o imposta il semaforo a 1.",
      type: 'code',
      code: `/* Syscall dispatch (reg_a0) */
case CREATEPROCESS:  createProcess(...);
case TERMPROCESS:    termProcess(pid);
case PASSEREN:       passeren(sem);   /* P() */
case VERHOGEN:       verhogen(sem);   /* V() */
case DOIO:           doIO(cmdAddr, cmdVal);
case GETTIME:        getTime();
case CLOCKWAIT:      clockWait();
case GETSUPPORTPTR:  getSupportPtr();
case GETPROCESSID:   getProcessId(parent);
case GETCHILDREN:    getChildren(buf, size);`,
      file: 'exceptions.c',
    },
  ],
}

function LayerDiagram({ lang }) {
  return (
    <div className="panda-layers">
      {layers.map((l) => (
        <div
          key={l.level}
          className={`panda-layer${l.phase ? ` panda-layer--phase${l.phase}` : ''}${l.dim ? ' panda-layer--dim' : ''}${l.hw ? ' panda-layer--hw' : ''}`}
        >
          <span className="panda-layer-level">{l.level}</span>
          <span className="panda-layer-name">{lang === 'it' ? l.it : l.en}</span>
          {l.phase && <span className="panda-layer-badge">Phase {l.phase}</span>}
        </div>
      ))}
    </div>
  )
}

function CodeBlock({ code, file }) {
  return (
    <div className="panda-code-wrapper">
      <div className="panda-code-header">
        <span className="panda-code-file">{file}</span>
        <span className="panda-code-lang">C</span>
      </div>
      <pre className="panda-code"><code>{code}</code></pre>
    </div>
  )
}

export default function PandaShowcase({ lang }) {
  const content = sections[lang] || sections.en

  return (
    <div className="panda-showcase">
      {content.map((section, i) => (
        <div key={i} className={`panda-section ${i % 2 === 1 ? 'panda-section--reverse' : ''}`}>
          <div className="panda-section-text">
            <h4 className="panda-section-title">{section.title}</h4>
            <p>{section.text}</p>
          </div>
          <div className="panda-section-visual">
            {section.type === 'layers' && <LayerDiagram lang={lang} />}
            {section.type === 'code' && <CodeBlock code={section.code} file={section.file} />}
          </div>
        </div>
      ))}
    </div>
  )
}

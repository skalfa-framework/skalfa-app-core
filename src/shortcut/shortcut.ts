export type ShortcutHandler = (e: KeyboardEvent) => void

export type ShortcutType = {
  key: string
  description?: string
  handler: ShortcutHandler
}



const handlers = new Map<string, ShortcutType>()

export const shortcut = {
  // ==============================>
  // ## Shortcut register handler
  // ==============================>
  register: (key: string, handler: ShortcutHandler, description?: string) => {
    handlers.set(key, { key, handler, description })
  },

  // ==============================>
  // ## Shortcut unregister handler
  // ==============================>
  unregister: (key: string) => handlers.delete(key),

  // ==============================>
  // ## Shortcut list handler
  // ==============================>
  list: () => Array.from(handlers.values()),

  // ==============================>
  // ## Shortcut init handler
  // ==============================>
  init: () => {
    window.addEventListener("keydown",(e) => {
      const target = e.target as HTMLElement

      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return

      const combo = [e.ctrlKey && "ctrl", e.shiftKey && "shift", e.altKey && "alt", e.key.toLowerCase()].filter(Boolean).join("+")

      const meta = handlers.get(combo)
      if (meta) {
        e.preventDefault()
        e.stopPropagation()
        meta.handler(e)
      }
    },true)
  }

}

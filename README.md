<p align="center">
<h1 align="center">use-click-outside</h1>
</p>

#### Supported Platforms
<img src="https://stefkors.com/api/platform/index.svg?os=web" />

React hook to detect and respond to clicks outside a referenced element. Useful for closing dropdowns, modals, popovers, and other dismissible UI.

## Install

```bash
bun add @kors/use-click-outside
```

## Usage

```tsx
import { useRef } from "react"
import { useClickOutside } from "@kors/use-click-outside"

function Dropdown() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(true)

  useClickOutside(ref, () => setOpen(false), open)

  if (!open) return null

  return (
    <div ref={ref}>
      <p>Click outside to close</p>
    </div>
  )
}
```

## API

### `useClickOutside(ref, handler, enabled?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ref` | `RefObject<T \| null>` | — | Ref to the element to watch |
| `handler` | `(event: ClickOutsideEvent) => void` | — | Called when a click outside is detected |
| `enabled` | `boolean` | `true` | Toggle the listener on or off |

### Types

| Type | Definition |
|------|------------|
| `ClickOutsideEvent` | `MouseEvent \| TouchEvent` |

## License

MIT

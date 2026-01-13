import { cn } from '@claimscrub/ui'

interface KeyboardHintProps {
  keys: string[]
  label?: string
  className?: string
}

export function KeyboardHint({ keys, label, className }: KeyboardHintProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <span key={key}>
            <kbd className="kbd">{key}</kbd>
            {index < keys.length - 1 && <span className="mx-0.5 text-neutral-400">+</span>}
          </span>
        ))}
      </div>
      {label && <span className="text-body-sm text-neutral-500">{label}</span>}
    </div>
  )
}

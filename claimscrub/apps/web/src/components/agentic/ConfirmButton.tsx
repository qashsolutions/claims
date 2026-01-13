import { Button, type ButtonProps } from '@claimscrub/ui'
import { KeyboardHint } from './KeyboardHint'

interface ConfirmButtonProps extends ButtonProps {
  showHint?: boolean
}

export function ConfirmButton({
  children,
  showHint = true,
  ...props
}: ConfirmButtonProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <Button {...props}>{children}</Button>
      {showHint && <KeyboardHint keys={['Tab', 'Enter']} className="text-xs" />}
    </div>
  )
}

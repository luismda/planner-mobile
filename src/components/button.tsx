import clsx from 'clsx'
import { createContext, useContext } from 'react'
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

type Variant = 'primary' | 'secondary'

interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant
  isLoading?: boolean
}

const SharedPropsContext = createContext<{ variant?: Variant }>({})

function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = props.disabled || isLoading

  return (
    <TouchableOpacity
      className={clsx(
        'h-11 flex-row items-center justify-center gap-2 rounded-lg',
        {
          'bg-lime-300': variant === 'primary',
          'bg-zinc-800': variant === 'secondary',
          'bg-lime-300/60': variant === 'primary' && isDisabled,
          'bg-zinc-800/60': variant === 'secondary' && isDisabled,
        },
        className,
      )}
      activeOpacity={0.9}
      disabled={isLoading}
      {...props}
    >
      <SharedPropsContext.Provider value={{ variant }}>
        {isLoading ? <ActivityIndicator className="text-lime-950" /> : children}
      </SharedPropsContext.Provider>
    </TouchableOpacity>
  )
}

function Title(props: TextProps) {
  const { variant } = useContext(SharedPropsContext)

  return (
    <Text
      className={clsx('font-semibold text-base', {
        'text-lime-950': variant === 'primary',
        'text-zinc-200': variant === 'secondary',
      })}
      {...props}
    />
  )
}

Button.Title = Title

export { Button }

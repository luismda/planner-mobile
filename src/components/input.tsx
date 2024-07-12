import { clsx } from 'clsx'
import {
  Platform,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native'

import { colors } from '@/styles/colors'

type Variant = 'primary' | 'secondary' | 'tertiary'

interface InputProps extends ViewProps {
  variant?: Variant
}

function Input({ variant = 'primary', className, ...props }: InputProps) {
  return (
    <View
      className={clsx(
        'max-h-11 min-h-11 flex-row items-center gap-2',
        {
          'max-h-14 min-h-14 rounded-lg border border-zinc-800 px-4':
            variant !== 'primary',
          'bg-zinc-950': variant === 'secondary',
          'bg-zinc-900': variant === 'tertiary',
        },
        className,
      )}
      {...props}
    />
  )
}

interface FieldProps extends TextInputProps {}

function Field(props: FieldProps) {
  return (
    <TextInput
      className="flex-1 font-regular text-lg text-zinc-100"
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[100]}
      selectionColor={Platform.OS === 'ios' ? colors.zinc[100] : undefined}
      {...props}
    />
  )
}

Input.Field = Field

export { Input }

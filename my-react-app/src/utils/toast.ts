import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (msg: string) => sonnerToast.success(msg),
  info: (msg: string) => sonnerToast(''+msg),
  error: (msg: string) => sonnerToast.error(msg),
}

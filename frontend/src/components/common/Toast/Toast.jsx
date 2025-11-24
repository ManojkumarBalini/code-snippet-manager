// This component is handled by react-hot-toast, so we don't need a custom component
// But we can create a custom hook for toast notifications if needed

import { toast as hotToast } from 'react-hot-toast'

export const toast = {
  success: (message) => hotToast.success(message),
  error: (message) => hotToast.error(message),
  loading: (message) => hotToast.loading(message),
  custom: (message, options) => hotToast(message, options)
}

export default toast
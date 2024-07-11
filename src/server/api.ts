import axios from 'axios'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
})

import { HWDetails } from './types'
import {
  SYS_MODE_NODEJS,
  SYS_MODE_WEBBROWSER,
} from './constants'

// Numbers

const S_DIVIDER = 1000
const MN_DIVIDER = 60000
const HR_DIVIDER = 3600000

export const d = (millis: number): string => {
  if (millis < S_DIVIDER) return `${millis}ms`
  if (millis < MN_DIVIDER) return `${millis / S_DIVIDER}s`
  if (millis < HR_DIVIDER) {
    const mn: number = Math.trunc(millis / MN_DIVIDER)
    const remainingS = millis % MN_DIVIDER
    const s: number = remainingS / S_DIVIDER
    let fmt = `${mn}mn`
    if (s) fmt += ` ${s}s`
    return fmt
  }
  const hr: number = Math.trunc(millis / HR_DIVIDER)
  const remainingMn = millis % HR_DIVIDER
  const mn: number = Math.trunc(remainingMn / MN_DIVIDER)
  const remainingS = remainingMn % MN_DIVIDER
  const s: number = remainingS / S_DIVIDER
  let fmt = `${hr}hr`
  if (mn) fmt += ` ${mn}mn`
  if (s) fmt += ` ${s}s`
  return fmt
}

export const size = (nb: number): { value: number, unit: string } => {
  const units = ['kB', 'MB', 'GB']
  return units.reduce(
    (s, unit) => {
      if (s.value / 1024 >= 1) {
        s.value = s.value / 1024
        s.unit = unit
      }
      return s
    },
    { value: nb, unit: 'B' },
  )
}

// System

type XPerformance = Performance & {
  memory: {
    jsHeapSizeLimit: number
  }
}

export const getRunningMode = (): string => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined')
    return SYS_MODE_WEBBROWSER
  if (typeof window === 'undefined' || typeof process !== 'undefined')
    return SYS_MODE_NODEJS
}

const getNodeOS = () => require('node:os')

const detectOS = (): string => {
  if (getRunningMode() === SYS_MODE_WEBBROWSER && globalThis.navigator) {
    const raw = [
      ...globalThis.navigator.userAgent.matchAll(
        /(windows|mac(intosh)?|ubuntu|debian|linux|cros)/gi,
      ),
    ]
    const match = raw.length ? raw[0][0].toLowerCase() : undefined
    return {
      windows: 'Windows',
      mac: 'Mac',
      macintosh: 'Mac',
      linux: 'Linux',
      cros: 'Chrome OS',
    }[match]
  }
  if (getRunningMode() === SYS_MODE_NODEJS) {
    const os = process.platform
    return os.charAt(0).toUpperCase() + os.substring(1)
  }
}

const detectArchitecture = (): string => {
  if (getRunningMode() === SYS_MODE_WEBBROWSER && globalThis.navigator) {
    const raw = [
      ...globalThis.navigator.userAgent.matchAll(/(x32|x64|x86_64)/gi),
    ]
    const match = raw.length ? raw[0][0].toLowerCase() : undefined
    return ['x64', 'x86_64', 'Mac'].includes(match) ? '64-bit' : '32-bit'
  }
  if (getRunningMode() === SYS_MODE_NODEJS && process)
    return ['x64', 'x86_64'].includes(process.arch) ? '64-bit' : '32-bit'
}

export const getHardwareDetails = (): HWDetails => {
  const details = {
    os: detectOS(),
    architecture: detectArchitecture(),
    cpus: undefined,
    memory: undefined,
  }
  if (getRunningMode() === SYS_MODE_WEBBROWSER && globalThis.navigator) {
    details.cpus = navigator.hardwareConcurrency || undefined
    const memory = (performance as XPerformance).memory
      ? size((performance as XPerformance).memory?.jsHeapSizeLimit)
      : undefined
    details.memory = memory
      ? `${memory.value.toFixed(2)} ${memory.unit} (allocated)`
      : undefined
  }
  if (getRunningMode() === SYS_MODE_NODEJS) {
    const os = getNodeOS()
    const memory = size(os.totalmem())
    details.cpus = os.cpus().length
    details.memory = `${memory.value.toFixed(2)} ${memory.unit} (total)`
  }
  return Object.entries(details).reduce((d, [name, value]) => {
    if (value === undefined) value = '-'
    d[name] = value
    return d
  }, details)
}

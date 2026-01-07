const isDev = import.meta.env.DEV
export const log = (...args: any[]) => isDev && console.log(...args)

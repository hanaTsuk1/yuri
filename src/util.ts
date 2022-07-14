export const isUndefined = (value: unknown): value is undefined =>
  value === undefined

export const isEmptyString = (value: string) => value.length === 0

export const isNull = (value: unknown): value is null => value === null

const isDev = process.env.NODE_ENV === 'development'

export const warn = (msg: string) => {
  if (isDev) {
    console.warn(msg)
  }
}

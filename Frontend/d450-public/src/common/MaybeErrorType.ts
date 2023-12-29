type IsError = {
  errors: string[]
}

type TrueResult = true

type NeverError<T> = T & { errors?: never }

type MaybeError<T> = IsError | NeverError<T>
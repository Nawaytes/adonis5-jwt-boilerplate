export interface InvalidInputWithErrorBag {
  errorBag: string
  invalidInput: any
}

export interface UnprocessableInputs {
  [key: string]: InvalidInputWithErrorBag
}

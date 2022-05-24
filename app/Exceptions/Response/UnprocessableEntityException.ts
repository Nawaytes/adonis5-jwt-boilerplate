import BaseResponseException from './BaseResponseException'

export default class UnprocessableEntityException extends BaseResponseException {
  public defaultStatus() {
    return 422
  }

  public defaultCode() {
    return 'E_UNPROCESSABLE_ENTITY'
  }

  public defaultMessage() {
    return 'Unprocessable Entity'
  }
}

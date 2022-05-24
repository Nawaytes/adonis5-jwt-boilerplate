import BaseResponseException from './BaseResponseException'

export default class InternalServerErrorException extends BaseResponseException {
  public defaultStatus() {
    return 500
  }

  public defaultCode() {
    return 'E_INTERNAL_SERVER_ERROR'
  }

  public defaultMessage() {
    return 'Internal Server Error'
  }
}

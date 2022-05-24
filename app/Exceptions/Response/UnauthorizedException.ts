import { HTTP_STATUS_UNAUTHORIZED } from 'App/Helper/response'
import BaseResponseException from './BaseResponseException'

export default class UnauthorizedException extends BaseResponseException {
  public defaultStatus() {
    return HTTP_STATUS_UNAUTHORIZED
  }

  public defaultCode() {
    return 'E_UNAUTHORIZED'
  }

  public defaultMessage() {
    return 'Unauthorized'
  }
}

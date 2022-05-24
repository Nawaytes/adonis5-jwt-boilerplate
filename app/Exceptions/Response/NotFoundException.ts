import { HTTP_STATUS_NOT_FOUND } from 'App/Helper/response'
import BaseResponseException from './BaseResponseException'

export default class NotFoundException extends BaseResponseException {
  public defaultStatus() {
    return HTTP_STATUS_NOT_FOUND
  }

  public defaultCode() {
    return 'E_NOT_FOUND'
  }

  public defaultMessage() {
    return 'Not Found'
  }
}

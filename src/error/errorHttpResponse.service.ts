import { responseConstant } from './response.constant';
import { CustomError } from './customError.service';

export class ErrorHttpResponse {
  error: any;

  constructor(error: any) {
    this.error = error;
  }

  public generate(): any {
    let response: any;

    if (Array.isArray(this.error) === true) response = this.error;
    else if (this.error instanceof CustomError) response = this.error.errors;
    else {
      response = [
        {
          type: 'system',
          values: [
            {
              msg: this.error.message,
              code: responseConstant.COMMON.UNKNOWN_ERROR.CODE
            }
          ]
        }
      ];
    }
    return response;
  }
}

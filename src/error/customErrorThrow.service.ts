import { CodedError, CustomError } from './customError.service';

export const throwVerificationErrorMsg = (msg: string, code: string) => {
    const errors: [CodedError] = [
        {
            msg,
            code
        }
    ];

    return new CustomError(errors);
};

export const throwValidationErrorMsg = (error: any) => {
    if (error?.errors) {
        return error?.errors[0]?.message?.split('.')?.pop();
    } else {
        return error?.message;
    }
};

import { CodedError } from './customError.service';

export interface ErrorsTypes {
    type: string;
    values: CodedError[];
}

export interface ErrorResponseTypes {
    success: boolean;
    message: string;
    code: string;
    errors: ErrorsTypes[] | null;
}

export type CodedError = {
    msg: string;
    code?: string;
    attribute?: string | null;
};

export type ErrorMessage = {
    type: string;
    values: [CodedError];
};

export class CustomError extends Error {
    public errors: [ErrorMessage];

    constructor(errors: [CodedError]) {
        super();
        this.errors = [{ type: 'system', values: errors }];
    }
}

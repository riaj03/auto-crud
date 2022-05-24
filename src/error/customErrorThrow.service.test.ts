import { throwValidationErrorMsg } from './customErrorThrow.service';

describe('throwValidationErrorMsg method', () => {
    it('TEST CASE 01:', () => {
        const error = {
            message: 'Validation Error'
        };

        const response = throwValidationErrorMsg(error);
        expect(response).toEqual('Validation Error');
    });

    it('TEST CASE 02:', () => {
        const error = {
            errors: [
                {
                    message: 'username is unique'
                }
            ]
        };

        const response = throwValidationErrorMsg(error);
        expect(response).toEqual('username is unique');
    });

    it('TEST CASE 03:', () => {
        const error = {
            errors: [
                {
                    message: 'User.username is unique'
                }
            ]
        };

        const response = throwValidationErrorMsg(error);
        expect(response).toEqual('username is unique');
    });
});

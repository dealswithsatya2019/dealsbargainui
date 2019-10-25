import { AuthTokenInfo } from 'src/app/models/authTokenInfo';

export class AuthResopnse {
    statusCode: number;
    statusDesc: string;
    responseObjects: AuthTokenInfo;
}
import { AuthTokenInfo } from 'src/app/models/AuthTokenInfo';

export class AuthResopnse {
    statusCode: number;
    statusDesc: string;
    responseObjects: AuthTokenInfo;
}
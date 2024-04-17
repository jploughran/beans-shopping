import { CognitoUserPool, ICognitoUserPoolData } from 'amazon-cognito-identity-js';

const UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || '';
const ClientId = process.env.AWS_COGNITO_CLIENT_ID || '';

const poolData: ICognitoUserPoolData = {
    UserPoolId,
    ClientId,
};
export default new CognitoUserPool(poolData);

import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  const jwt = request.headers.get('authorization');
  if (!jwt) {
    return new Response(`UnAuthorized`, { status: 401 });
  }

  const base64Payload = jwt.split('.')[1];
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  console.log('payloadBuffer ' + payloadBuffer.toString());
  const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
  if (!request.headers['auth0UserId'])
    request.headers['auth0UserId'.toLowerCase()] = updatedJwtPayload.sub;
  if (!request.headers['organizationId'.toLowerCase()])
    request.headers['organizationId'.toLowerCase()] = updatedJwtPayload.org_id;
  if (!request.headers['permissions'])
    request.headers['permissions'] = (updatedJwtPayload.permissions || []).join(
      ',',
    );
  //todo add code to call iam in here 
  return request;
}

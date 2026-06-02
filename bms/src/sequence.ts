import {inject} from '@loopback/core';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from 'loopback4-authorization';
import {UserProfile} from '@loopback/security';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.SEND) public send: Send,
    @inject(RestBindings.SequenceActions.REJECT) public reject: Reject,
    // 1. Inject the Authentication Action
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<UserProfile>,
    // 2. Inject the Authorization Action
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      // Add CORS headers to ALL responses
      this.addCorsHeaders(response);

      // Handle CORS preflight requests BEFORE anything else
      if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
      }

      // Step A: Find the requested route based on the URL
      // This will throw 404 if route not found - let it propagate
      const route = this.findRoute(request);

      // Step B: Authenticate the Request (Checks for @authenticate and Validates JWT)
      const authUser = await this.authenticateRequest(request, response);

      // Step C: Authorize the Request (Checks for @authorize and Validates Permissions)
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser?.permissions,
        request,
      );

      // If user doesn't have a valid token or permission, bounce them
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      // Step D: Parse parameters and invoke the controller method
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      // Step E: Send response back to the client
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }

  private addCorsHeaders(response: any) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

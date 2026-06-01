import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent} from 'loopback4-authentication';
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
} from '@sourceloop/core';
import {AuthorizationComponent, AuthorizationBindings} from 'loopback4-authorization';
// import {BasicAuthenticationStrategy} from './strategies'; // We will update this or use SourceFuse's
import {JwtService} from './services';
import {BcryptHasher} from './services';
import {MyUserService} from './services';
import {AuthenticationBindings, Strategies, STRATEGY} from 'loopback4-authentication';
import {LocalPasswordVerifyProvider} from './providers/local-password-verify.provider';
import {BearerTokenVerifyProvider} from './providers/bearer-token-verify.provider';

export {ApplicationConfig};

export class BmsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);



    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Bind authorization configuration
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });

    this.component(AuthenticationComponent);
    // this.component(AuthenticationServiceComponent);

    /*
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
      useSymmetricEncryption: true,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);
    */

    this.component(AuthorizationComponent);

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'bms',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: {
          [STRATEGY.BEARER]: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          [STRATEGY.BEARER]: [],
        },
      ],
      servers: [{url: '/'}],
    });

    // Bind local password verify provider
    this.bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER).toProvider(
      LocalPasswordVerifyProvider,
    );
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    // Bind JWT secret and services
    this.bind('authentication.jwt.secret').to(
      process.env.JWT_SECRET || 'your-fallback-secret-here-for-local-dev'
    );
    this.bind('authentication.jwt.expiresIn').to('24h');
    this.bind('rounds').to(10);

    // this.bind('services.jwt.service').toClass(JwtService);
    this.bind('services.user.service').toClass(MyUserService);
    this.bind('services.hash.password').toClass(BcryptHasher);

    // Bind JWT token service for authentication strategy
    // this.bind('services.authentication.jwt.tokenservice').toClass(JwtService);
    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({debug: true});
    this.configure('rest.cors').to({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Your React App URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js', '.controller.ts'],
        nested: true,
      },
      models: {
        dirs: ['models'],
        extensions: ['.model.js', '.model.ts'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js', '.repository.ts'],
        nested: true,
      },
    };
  }
}

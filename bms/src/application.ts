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
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from '@loopback/authentication-jwt';
import {BasicAuthenticationStrategy} from './strategies';
import {JwtService} from './services';
import {BcryptHasher} from './services';
import {MyUserService} from './services';

export {ApplicationConfig};

export class BmsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.restServer.config.cors = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400,
      credentials: true,
    };

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Add authentication component
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    registerAuthenticationStrategy(this, BasicAuthenticationStrategy);

    // Bind JWT secret and services
    this.bind('authentication.jwt.secret').to(
      process.env.JWT_SECRET || 'your-secret-key-change-this',
    );
    this.bind('authentication.jwt.expiresIn').to('24h');
    this.bind('rounds').to(10);

    this.bind('services.jwt.service').toClass(JwtService);
    this.bind('services.user.service').toClass(MyUserService);
    this.bind('services.hash.password').toClass(BcryptHasher);

    // Bind JWT token service for authentication strategy
    this.bind('services.authentication.jwt.tokenservice').toClass(JwtService);
    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({debug: true});
    this.configure('rest.cors').to({
      origin: ['http://localhost:5173'], // Your React App URL
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

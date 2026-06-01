import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Book} from '../models';
import {BookRepository} from '../repositories';

export class BooksController {
  constructor(
    @repository(BookRepository)
    public booksRepository : BookRepository,
  ) {}

  @post('/books')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Books model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBooks',
            exclude: ['id'],
          }),
        },
      },
    })
    books: Omit<Book, 'id'>,
  ): Promise<Book> {
    return this.booksRepository.create(books);
  }

  @get('/books/count')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Books model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.booksRepository.count(where);
  }


  @authenticate(STRATEGY.BEARER)
  // @authorize({permissions: ['*']})
  @get('/books')
  @response(200, {
    description: 'Array of Books model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.booksRepository.find(filter);
  }

  @patch('/books')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Books PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    books: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.booksRepository.updateAll(books, where);
  }

  @get('/books/{id}')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Books model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, {exclude: 'where'}) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.booksRepository.findById(id, filter);
  }

  @patch('/books/{id}')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(204, {
    description: 'Books PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    books: Book,
  ): Promise<void> {
    await this.booksRepository.updateById(id, books);
  }

  @put('/books/{id}')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(204, {
    description: 'Books PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() books: Book,
  ): Promise<void> {
    await this.booksRepository.replaceById(id, books);
  }

  @del('/books/{id}')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(204, {
    description: 'Books DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.booksRepository.deleteById(id);
  }
}

import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}}) // You can set this to false to ignore extra fields
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({type: 'string', required: true})
  bookName: string;

  @property({type: 'string', required: true})
  author: string;

  @property({type: 'string'}) // Changed to string to accept "YYYY-MM-DD"
  publishDate?: string;

  @property({type: 'string'})
  genre?: string;

  @property({type: 'number'})
  ebookSize?: number;

  @property({type: 'number'})
  price: number;

  @property({type: 'number'})
  discount?: number;

  // Added this because your backend is requiring it
  @property({type: 'string', required: true})
  finalPrice: string;

  // Add any other fields from your JSON here (isbn, age, pageNo, bookType)
  @property({type: 'number'})
  isbn?: number;

  @property({type: 'string'})
  bookType?: string;

  @property({type: 'number'})
  pageNo?: number;

  @property({type: 'number'})
  age?: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}
export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getBook } from '../../services/booksApi';
 
export default class BookDetail extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    history: PropTypes.object
  };

  state = {
    book: null
  };

  componentDidMount() {
    getBook(this.props.id)
      .then(book => {
        this.setState({ book: book.volumeInfo });
      });
  }
    
  render() {
    const { book } = this.state;

    if(book === null) return null;

    const { title, imageLinks, authors, description } = book;

    return (
      <div>
        <p>Book Detail!!!</p>
        {title && <h3>Title: {title}</h3>}
        {!title && <h3>Title: Unavailable</h3>}
        {imageLinks && imageLinks.smallThumbnail && <img src={imageLinks.smallThumbnail}/>}
        {!imageLinks && <img src={'https://gangarams.com/image/cache/placeholder-250x250.png'}/>}
        {authors && <p>Author: {authors[0]}</p>}
        {!authors && <p>Author: Unavailable</p>}
        {description && <p>{description}</p>}
        {!description && <p>Unavailable</p>}
      </div>
    );
  }

}
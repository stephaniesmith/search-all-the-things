import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';
import Books from '../books/Books';
import { search } from '../../services/booksApi';
import queryString from 'query-string';
import Paging from '../books/Paging';

const getSearch = location => location ? location.search : '';

export default class Search extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };
  
  state = {
    searchTerm: '',
    books: null,
    error: null,
    totalBooks: null,
    loading: false,
    page: 1,
    perPage: 10
  };

  componentDidMount() {
    this.searchFormQuery(this.props.location.search);
  }

  componentWillReceiveProps({ location }) {
    const next = getSearch(location);
    const current = getSearch(this.props.location);
    if(current === next) return;
    this.searchFormQuery(next);
  }

  searchFormQuery(query) {
    const { search: searchTerm } = queryString.parse(query);
    const { page, perPage } = this.state;
    this.setState({ searchTerm });
    if(!searchTerm) return;

    this.setState({ loading: true });

    search(searchTerm, page, perPage)
      .then(({ items, totalItems }) => {
        this.setState({ books: items, totalBooks: totalItems });
      })
      .catch(error => {
        this.setState({ error });
      });

    this.setState({ loading: false });
  }

  makeSearch = () => {
    this.setState({ error: null });
    const { searchTerm, page } = this.state;

    const query = {
      search: searchTerm || '',
      page: page || 1
    };

    this.props.history.push({
      search: queryString.stringify(query)
    });
  };

  handleSearch = searchTerm => {
    this.setState({
      error: null,
      searchTerm,
      Paging: 1
    }, this.makeSearch);
  };

  handlePaging = page => {
    this.setState({
      error: null,
      page
    }, this.makeSearch);
  };
  
  render() {
    const { searchTerm, books, error, totalBooks, loading, page, perPage } = this.state;

    return (
      <div>
        <SearchForm searchTerm={searchTerm} onSearch={this.handleSearch}/>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {searchTerm && <p>Results for: {searchTerm}</p>}
        {(!error && totalBooks) && <Paging totalBooks={totalBooks} page={page} perPage={perPage} onPaging={this.handlePaging}/>}
        {(!error && books) && <Books books={books}/>}
      </div>
    );
  }
}
import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from '../actions/index';
import actions from '../actions/index';
// Imagine you have a list of languages that you'd like to autosuggest.
// const languages = [
//   {
//     name: 'C',
//     year: 1972
//   },
//   {
//     name: 'Elm',
//     year: 2012
//   }
// ];

class SearchBar extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      key: '',
      books: [
          {
              title: 'Early Transcendentals',
              author: 'Stewart',
              key: '596fea7c734d1d6202a70d1f',
          },
          {
              title: 'Early Transcendentals',
              author: 'Anton',
              key: 2,
          },
          {
              title: 'Principles of Economics',
              author: 'Frank',
              key: 3,
          },
          {
              title: 'Probability',
              author: 'Pitman',
              key: 4,
          }
      ]
  };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  // componentDidMount() {
  //     axios.get('/api/searchbar/', {
  //         headers: {
  //             'Authorization': 'Bearer ' + this.props.token
  //         }
  //     })
  //     .then((res) => {
  //         if (res.data.success) {
  //             this.setState({
  //                 books: res.data.books
  //             });
  //         }
  //     })
  //     .catch((err) => {
  //         console.log('ERR', err);
  //     })
  // }

  // Use your imagination to render suggestions.
  renderSuggestion(suggestion) {
      return (<span>{suggestion.title}, {suggestion.author}</span>);
  }
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions(value){
      console.log(value);
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
     if (inputLength === 0) {
         return [];
     }
     const suggestions = this.state.books.filter(book => book.title.toLowerCase().slice(0, inputLength) === inputValue);
     return suggestions;
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue (suggestion) {
      console.log("SUGGESTION", suggestion);
      this.setState({
          key: suggestion.key
      });
      console.log("GET SUGGESTION VALUE", this.state)
      return suggestion.title;
  }

  onChange (event, { newValue }) {
      event.preventDefault();
      console.log("newVal:", newValue)
      this.setState({
          value: newValue
      });
      console.log("val:", this.state.value);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
     console.log("fetched req:", value)
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };
  onSearch (e) {
      console.log("SEARCH BUTTON CLICKED")
      e.preventDefault();
      this.props.search(this.state.key)
      console.log(this.state)
    //   this.props.search(this.state.key)
      console.log("VALUE", this.state.key);
  }

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for a book',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
        <div>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
            <button onClick={(e)=>{this.onSearch(e)}}>Search!</button>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {
        token: state.reducer.token
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        search: (value) => {
            dispatch(actions.search(value));
        }
    };
};

SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);

export default SearchBar;

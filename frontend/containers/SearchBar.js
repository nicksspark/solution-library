import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from '../actions/index';
import actions from '../actions/index';
// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    console.log(value);
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
   if (inputLength === 0) {
       return [];
   }
   const suggestions = languages.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue);
   return suggestions;
};



// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <span>{suggestion.name}, {suggestion.year}</span>
);

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
      key: ''
  };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
  }
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue (suggestion) {
      this.setState({
          key: suggestion.year
      });
      console.log(this.state)
      return suggestion.name;
  }

  onChange (event, { newValue }) {
      event.preventDefault();
      console.log("newVal:", newValue)
      this.setState({
          value: newValue
      });
      console.log("val:", this.state.value);
  };

  getId (suggestion) {
      this.setState({
          key: suggestion.year
      });
      console.log(this.state.key);
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
     console.log("fetched req:", value)
    this.setState({
      suggestions: getSuggestions(value)
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
      placeholder: 'Type a programming language',
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
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
            <button onClick={(e)=>{this.onSearch(e)}}>Search!</button>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {
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

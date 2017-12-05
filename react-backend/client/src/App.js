import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      searchTerm: '',
      userData: [],
      allLangs: ['javascript', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'go', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allLangsJSX: []
    };
    this.state.allLangs.sort();

    this.handleLangAdd = this.handleLangAdd.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleLangDelClick = this.handleLangDelClick.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
  }

  handleSearchChange(event) {
    var searchTerm = this.refs.searchTerm.value;
    this.setState({searchTerm:searchTerm});
    event.preventDefault();
  }

  handleLangAdd(event) {
    var lastUserAddedLang = this.refs.userAddLang.value;
    var userData = this.state.userData.slice();
    var allLangs = this.state.allLangs.slice();
    if (!userData.some((element) => {return element.language === lastUserAddedLang}) && allLangs.includes(lastUserAddedLang)) {
      document.getElementById('userLangInput').value ="";
      userData.push({language:lastUserAddedLang});
    }

    event.preventDefault();
    this.setState({userData:userData});
  }

  handleLangDelClick(event) {
    var elemNum = event.target.id.slice(-1);
    var userData = this.state.userData.slice();
    userData.splice(elemNum, 1);
    this.setState({userData:userData});
  }

  handleWeightsSubmit(event) {
    var userData = this.state.userData.slice();
    for (let i = 0; i < userData.length; i++) {
      userData[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();
    this.setState({userData:userData});
    var dataPackage = {
      searchTerm: this.state.searchTerm,
      userData: userData
    }
    fetch('/getresults/', {
      method: 'POST',
      body: dataPackage
    }).then(function(res) {
      return res.json();
    }).then(function(response) {
      // var data = JSON.parse(response);
      console.log(response);
    });
  }

  render() {
    var allLangs = this.state.allLangs.slice();
    var allLangsJSX = [];
    for (let i = 0; i < allLangs.length; i++) {
      allLangsJSX.push(<option value={allLangs[i]} />);
    }
    allLangsJSX = [
      <datalist id="languages">
        {allLangsJSX}
      </datalist>
    ];

    var userData = this.state.userData.slice();
    var userDataJSX = [];
    var userLangWeightsJSX = [];
    for (let i = 0; i < userData.length; i++) {
      userDataJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} class="delete-lang" onClick={this.handleLangDelClick}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userData[i].language}</span>
        </div>
      );
      userLangWeightsJSX.push(
        <div>{userData[i].language}: <input className="weight-input" ref={'langWeight'+i} /></div>
      );
    }
    if (userDataJSX.length === 0) {
      userDataJSX = [<div className="user-lang-div" id="user-lang-div-placeholder"></div>];
    }
    userLangWeightsJSX = [
      <form onSubmit={this.handleWeightsSubmit}>
        {userLangWeightsJSX}
        <input type="submit" value="Get Results!" />
      </form>
  ]


    return (
      <div className="App">
        <h2>jobSort()</h2>
        <div id="content">
          <div>
            <p id="step1">
              Step 1: Input your job search term.
            </p>
            <div>
              <form>
                <input id="userSearchInput" placeholder="web developer" ref="searchTerm" onChange={this.handleSearchChange}/>
              </form>
            </div>
          </div>
          <div>
            <p id="step2">
              Step 2: Input all the languages/frameworks you know.
            </p>
            <div>
              <form onSubmit={this.handleLangAdd}>
                <input id="userLangInput" list='languages' name='languages' ref="userAddLang"/>
                {allLangsJSX}
                <input type="submit" value="Add" />
              </form>
            </div>
            {userDataJSX}
          </div>
          <div>
            <p id="step3">
              Step 3: Assign weights to each language/framework based on how well you know them. A higher number means you know that language more.
            </p>
            {userLangWeightsJSX}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Form';
import BookTree from "./BookTree";

class App extends Component {
    constructor(){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state.onChange = {
            isChanged: false
        };
    }

    onChange(){
        this.setState({isChanged: true});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <BookTree/>
                <h3>追加</h3>
                <Form onchange={this.onChange}/>
            </div>
        );
    }
}

export default App;

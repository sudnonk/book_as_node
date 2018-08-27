import React, {Component} from 'react'
import FormType from './FormType'
import FormError from './FormError'

class Form extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.onSubmit = this.onSubmit.bind(this);
        this.setType = this.setType.bind(this);
        this.setText = this.setText.bind(this);
        this.setISBN = this.setISBN.bind(this);

        this.state = {
            type: "book",
            text: null,
            isbn: null,
            status: null
        };
    }


    onSubmit() {
        const data = {
            type: this.state.type,
            text: this.state.text,
            isbn: this.state.isbn
        };
        const method = "POST";
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        const body = Object.keys(data).map((key) => key + "=" + encodeURIComponent(data[key])).join("&");

        fetch("./register.php", {method, header, body})
            .then(function (res) {
                return res.json();
            })
            .then(function (json) {
                console.log(json.status);
            })
            .catch(console.error);

        return false;
    }

    setType(type) {
        this.setState({type: type});
    }

    setText(text) {
        this.setState({text: text});
    }

    setISBN(isbn) {
        this.setState({isbn: isbn});
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <FormError status={this.state.status}/>
                <FormType defaultType={this.state.type} defaultText={this.state.text} defaultISBN={this.state.isbn}
                          setType={this.setType} setText={this.setText} setISBN={this.setISBN}/>
                <button type="submit">送信</button>
            </form>
        );
    }
}

export default Form;
import React, {Component} from 'react'
import FormType from './FormType'
import FormError from './FormError'
import FormParent from './FormParent'

class Form extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.onSubmit = this.onSubmit.bind(this);
        this.setParent = this.setParent.bind(this);
        this.setType = this.setType.bind(this);
        this.setText = this.setText.bind(this);
        this.setISBN = this.setISBN.bind(this);

        this.state = {
            type: "book",
            text: null,
            isbn: null,
            status: null,
            parent: null
        };
    }


    onSubmit() {
        console.log("onsubmit");
        const data = {
            type: this.state.type,
            text: this.state.text,
            isbn: this.state.isbn,
            parent: this.state.parent
        };
        const method = "POST";
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        const body = Object.keys(data).map((key) => key + "=" + encodeURIComponent(data[key])).join("&");

        fetch("./backend.php", {method, headers, body})
            .then(function (res) {
                return res.json();
            })
            .then(function (json) {
                this.setState({status: json});
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

    setParent(parent) {
        this.setState({parent: parent});
    }

    render() {
        return (
            <form action="javascript:void(0);" onSubmit={this.onSubmit}>
                <FormError status={this.state.status}/>
                <FormParent defaultParent={this.state.parent} setParent={this.setParent}/>
                <FormType defaultType={this.state.type} defaultText={this.state.text} defaultISBN={this.state.isbn}
                          setType={this.setType} setText={this.setText} setISBN={this.setISBN}/>
                <button type="submit">送信</button>
            </form>
        );
    }
}

export default Form;
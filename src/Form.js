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
            text: "",
            isbn: "",
            status: null,
            parent: ""
        };
    }


    onSubmit(event) {
        console.log(this.props);
        const _self = this;

        const data = {
            type: this.state.type || "",
            text: this.state.text || "",
            isbn: this.state.isbn || "",
            parent: this.state.parent || ""
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
                _self.setState({status: json});
            })
            .catch(console.error);

        this.props.onChange();
        event.preventDefault();
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
        const _self = this;
        return (
            <form onSubmit={_self.onSubmit}>
                <FormError status={_self.state.status}/>
                <FormParent parent={_self.state.parent} setParent={_self.setParent}/>
                <FormType type={_self.state.type} text={_self.state.text} ISBN={_self.state.isbn}
                          setType={_self.setType} setText={_self.setText} setISBN={_self.setISBN}/>
                <button type="submit">送信</button>
            </form>
        );
    }
}

export default Form;
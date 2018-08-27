import React, {Component} from 'react'

class FormContent extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.onTextChange = this.onTextChange.bind(this);
        this.onISBNChange = this.onISBNChange.bind(this);

        this.state = {
            text: this.props.defaultText,
            isbn: this.props.defaultISBN
        };
    }

    onTextChange(event) {
        this.setState({text: event.target.value});
        this.props.setText(this.state.text);
    }

    onISBNChange(event) {
        this.setState({isbn: event.target.value});
        this.props.setISBN(this.state.isbn);
    }

    render() {
        if (this.props.type === "book") {
            return (
                <p>
                    <label htmlFor="isbn">ISBNコード</label><br/>
                    <input name="isbn" type="text" onChange={this.onISBNChange}/>
                </p>
            );
        } else {
            return (
                <p>
                    <label htmlFor="text">内容</label><br/>
                    <input name="text" type="text" onChange={this.onTextChange}/>
                </p>
            );
        }
    }
}

export default FormContent;
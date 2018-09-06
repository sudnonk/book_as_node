import React, {Component} from 'react'
import FormContent from "./FormContent";

class FormType extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.setAsText = this.setAsText.bind(this);
        this.setAsBook = this.setAsBook.bind(this);

        this.state = {
            type: this.props.type
        };
    }

    setAsBook() {
        this.props.setType("book");
        this.setState({type: "book"});
    }

    setAsText() {
        this.props.setType("text");
        this.setState({type: "text"});
    }

    render() {
        const isBook = this.state.type === "book";
        const isText = this.state.type === "text";

        return (
            <div>
                <p>
                    <span>種別</span><br/>
                    <label>
                        <input name="type" type="radio" checked={isBook}
                               onChange={this.setAsBook}/> 本
                    </label>
                    <label>
                        <input name="type" type="radio" checked={isText}
                               onChange={this.setAsText}/> テキスト
                    </label>
                </p>
                <FormContent text={this.props.text} isbn={this.props.isbn}
                             type={this.props.type} setText={this.props.setText} setISBN={this.props.setISBN}/>
            </div>
        );
    }
}

export default FormType;
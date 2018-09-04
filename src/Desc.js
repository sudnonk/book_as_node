import React, {Component} from 'react'

class Desc extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);

        this.state = {
            bookData: null,
            node: null
        };
    }

    async getBookData(isbn) {
        return await fetch("https://api.opendb.jp/v1/get?isbn=" + isbn)
            .then(function (res) {
                console.log(res);
                return res.json();
            })
            .then(function (data) {
                return JSON.parse(data[0]);
            })
            .catch(console.error);
    }

    async componentWillReceiveProps() {
        console.log(this.props);
        if (this.props.node !== null) {
            if (this.props.node.type === "book") {
                if (this.props.node.isbn !== null) {
                    let state = {};
                    state.bookData = await this.getBookData(this.props.node.isbn);
                    state.node = this.props.node;

                    this.setState(state);
                }
            }
        }
    }

    render() {
        if (this.state.node === null) {
            return <div>no description.</div>;
        }
        if (this.state.node.type === "book" && this.state.bookData !== null) {
            const bookData = this.state.bookData;
            console.log(bookData);
            return (
                <div>
                    <dl>
                        <dt>
                            ISBNコード
                        </dt>
                        <dd>
                            {this.state.node.isbn}
                        </dd>
                        <dt>
                            タイトル
                        </dt>
                        <dd>
                            {this.state.bookData.title}
                        </dd>
                        <dt>
                            著者
                        </dt>
                        <dd>
                            {this.state.bookData.author}
                        </dd>
                        <dt>
                            読書録URL
                        </dt>
                        <dd>
                            <a href={this.state.node.URL}>{this.state.node.URL}</a>
                        </dd>
                    </dl>
                </div>
            );
        } else if (this.state.node.type === "text") {
            return (
                <div>
                    <p>{this.state.node.text}</p>
                </div>
            );
        } else {
            return <div>no description.</div>;
        }
    }
}

export default Desc;
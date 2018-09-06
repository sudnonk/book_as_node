import React, {Component} from 'react'

class Desc extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);

        this.state = {
            bookData: null,
            node: null,
            text: null
        };
    }

    static async getBookData(isbn) {
        return await fetch("https://api.openbd.jp/v1/get?isbn=" + isbn)
            .then(function (res) {
                return res.json();
            })
            .then(function (json) {
                const data = json[0].summary;
                return {
                    author: data.author,
                    title: data.title
                };
            })
            .catch(console.error);
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.node !== null) {
            if (nextProps.node.type === "book") {
                if (nextProps.node.isbn !== null) {
                    let state = {};
                    state.bookData = await Desc.getBookData(nextProps.node.isbn);
                    state.node = nextProps.node;

                    this.setState(state);
                }
            } else if (nextProps.node.type === "text") {
                if (nextProps.node.text !== null) {
                    let state = {};
                    state.text = nextProps.node.text;
                    state.node = nextProps.node;

                    this.setState(state);
                }
            }
        }
    }

    render() {
        if (this.state.node === null) {
            return <div>四角をクリックするとここに詳細が表示されます。</div>;
        }
        if (this.state.node.type === "book" && this.state.bookData !== null) {
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
                    <p>{this.state.text}</p>
                </div>
            );
        } else {
            return <div>no description.</div>;
        }
    }
}

export default Desc;
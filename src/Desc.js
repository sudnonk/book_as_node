import React, {Component} from 'react'

class Desc extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);

        this.state = {
            bookData: null
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

    async render() {
        if (this.props.node === null || this.state.bookData === null) {
            return <div>no description.</div>;
        }
        const node = this.props.node.data;
        console.log(node);
        if (node.type === "book") {
            const bookData = await this.getBookData(node.ISBN);
            console.log(bookData);
            return (
                <div>
                    <dl>
                        <dt>
                            ISBNコード
                        </dt>
                        <dd>
                            {node.isbn}
                        </dd>
                        <dt>
                            タイトル
                        </dt>
                        <dd>
                            {bookData.title}
                        </dd>
                        <dt>
                            著者
                        </dt>
                        <dd>
                            {bookData.author}
                        </dd>
                        <dt>
                            読書録URL
                        </dt>
                        <dd>
                            <a href={node.URL}>{node.URL}</a>
                        </dd>
                    </dl>
                </div>
            );
        } else {
            return (
                <div>
                    <p>{node.text}</p>
                </div>
            );
        }
    }
}

export default Desc;
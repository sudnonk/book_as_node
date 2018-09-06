import React, {Component} from 'react';
import * as d3 from 'd3';
import Form from "./Form";
import Desc from "./Desc";

class BookTree extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.drawTree = this.drawTree.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            data: {},
            isChanged: false,
            selected: null,
        };
        this.fetchData();
    }

    //コンポーネントが配置されたときに呼ばれる
    componentDidMount() {
        this.drawTree();
    }

    //コンポーネントが更新されたときに呼ばれる
    componentDidUpdate() {
        this.drawTree();
    }

    /**
     * フォーム送信時に新しいデータを取ってくる
     */
    onChange() {
        this.fetchData();
    }

    /**
     * サーバからデータを取ってくる
     */
    fetchData() {
        const _self = this;
        fetch("./backend.php").then(function (res) {
            return res.json();
        }).then(function (json) {
            return JSON.parse(json.message);

        }).then(function (data) {
            _self.setState({data: data});
        })
            .catch(console.error);
    }

    drawTree() {
        const svgNode = this.node;
        const _self = this;

        svgNode.innerHTML = "";

        //データをツリー形式に変換する。この時ノードの相対位置とかも決まる。
        const root = d3.hierarchy(_self.state.data);

        let maxDepth = 0;
        root.each(function (d) {
            maxDepth = Math.max(d.depth, maxDepth);
        });

        const rectWidth = 150;
        const rectHeight = 50;

        const width = rectWidth * maxDepth * 1.5;
        const height = 1000;

        //ツリーを書くグラフ領域を設定
        let tree = d3.tree()
            .size([height, width])
            .separation(function () {
                return 0.1;
            });

        //グラフ領域にデータを設定する
        tree(root);

        //書き込むSVGをd3に登録
        const svg = d3.select(svgNode);
        //書き込み先のSVGのサイズを設定
        svg.attr("height", height).attr("width", width);
        //SVGにgタグを追加し、位置を調整
        const g = svg.append("g").attr("transform","translate(-200px,0)");

        //ノードをつなぐ線を描画する
        //SVGの線には.linkというタグが付けるので、それがついているものをすべて選択
        //*注意* この時点ではまだ.linkが付いた要素は存在しない。これから作る。.linkを作るよという宣言だけなので、後で明示的に書いて作らないといけない
        const link = g.selectAll(".link")
        //ノードのうち、一番根元には線がないのでそれ以外を選択
            .data(root.descendants().slice(1))
            //選択したノードをd3に登録
            .enter()
            //SVGのpathタグを追加
            .append("path")
            //linkクラスをセット
            .attr("class", "link")
            //描画領域の詳細
            .attr("d", function (d) {
                return "M" + (d.y + rectWidth / 2) + "," + (d.x + rectHeight) +
                    "L" + (d.parent.y + rectWidth / 2) + "," + (d.parent.x + rectHeight);
            });

        //ノードを描画する
        let node = g.selectAll(".node")
        //データを設定
            .data(root.descendants())
            //d3に登録
            .enter()
            //gタグを追加
            .append("g")
            //.nodeを追加
            .attr("class", "node")
            //位置を設定
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            })
            .on("click", function (d) {
                _self.setState({
                    selected: d.data,
                });
            });

        //一番根元を消す
        node.each(function (d) {
            if (d.data.name === "invisibleRoot")
                d3.select(this).remove();
        });
        link.each(function (d) {
            if (d.parent.data.name === "invisibleRoot")
                d3.select(this).remove();
        });


        //ノードを四角にする
        node.append("rect")
        //半径を設定
            .attr("class", "rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("stroke", "#000")
            //色を設定
            .attr("fill", "#fff")
            .attr("y", rectHeight / 2);

        //ノードに文字を追加する
        let text = node.append("text")
        //文字を書く場所
        //文字のサイズ
            .attr("font-size", "15")
            .attr("text-anchor", "middle")
            .attr("x", rectWidth / 2);

        //描画する文字
        //IDを表示
        text.append("tspan")
            .attr("y", rectWidth * 0.9 / 2)
            .text(function (d) {
                return d.data.name;
            });

        //内容を表示
        text.append("tspan")
            .attr("y", 20 + rectWidth * 0.9 / 2)
            .text(function (d) {
                if (d.data.type === "book") {
                    return d.data.isbn;
                } else {
                    return d.data.text;
                }
            });


    }

    render() {
        const _self = this;

        //Reactが生成したDOMを、this.nodeに入れる
        return (
            <div style={()=> "overflow: scroll,max-width:1000px"}>
                <Desc node={_self.state.selected}/>
                <svg ref={node => this.node = node}></svg>
                <h3>追加</h3>
                <Form onChange={_self.onChange}/>
            </div>
        );
    }
}

export default BookTree;
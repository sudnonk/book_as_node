import React, {Component} from 'react'
import * as d3 from 'd3';

class Hoge extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.hogeHoge = this.hogeHoge.bind(this);
    }

    //コンポーネントが配置されたときに呼ばれる
    componentDidMount() {
        this.hogeHoge();
    }

    //コンポーネントが更新されたときに呼ばれる
    componentDidUpdate() {
        this.hogeHoge();
    }

    hogeHoge(){

    }

    render() {
        //Reactが生成したDOMを、this.nodeに入れる
        return <svg ref={node => this.node = node}></svg>;
    }
}

export default Hoge;
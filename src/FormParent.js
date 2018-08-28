import React, {Component} from 'react'

class FormParent extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        //こうしないとthisがundefinedになる
        this.onChange = this.onChange.bind(this);

        this.state = {
            parent: this.props.defaultParent,
        };
    }

    onChange(event) {
        this.setState({parent: event.target.value});
        this.props.setParent(event.target.value);
    }

    render() {
        return (
            <p>
                <label htmlFor="text">親</label><br/>
                <input name="text" type="text" value={this.state.parent} onChange={this.onChange}/>
            </p>
        );
    }
}

export default FormParent;
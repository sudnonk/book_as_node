import React, {Component} from 'react'

class FormError extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);

        this.state = this.props.status;
    }

    render() {
        if (this.state === null) {
            return <br/>;
        } else {
            return <br/>;
        }
    }

}

export default FormError;
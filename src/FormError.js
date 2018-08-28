import React, {Component} from 'react'

class FormError extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.status);
        if (this.props.status === null) {
            return <br/>;
        } else {
            return (
                <p>
                    {this.props.status.message}
                </p>
            )
        }
    }

}

export default FormError;
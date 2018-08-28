import React, {Component} from 'react'

class FormError extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);
        console.log(this.props.status);
        this.state = this.props.status;
    }

    render() {
        if (this.state === null) {
            return <br/>;
        } else {
            return (
                <p>
                    {this.state.message}
                </p>
            )
        }
    }

}

export default FormError;
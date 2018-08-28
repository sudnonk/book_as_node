import React, {Component} from 'react'

class FormError extends Component {

    //コンストラクタ。props - 親から渡される情報
    constructor(props) {
        super(props);

        this.state = this.props.status;
    }

    render() {
        console.log(this.state);
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
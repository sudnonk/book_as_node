import React, {Component} from 'react'

class FormError extends Component {
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
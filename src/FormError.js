import React, {Component} from 'react'

class FormError extends Component {
    render() {
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
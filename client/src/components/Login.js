import axios from 'axios';
import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // checkUserJwtButton() {
    //     return (
    //         <Button
    //             text={'Check User Auth'}
    //             iconName={'add'}
    //             onClick={this.checkUser}
    //         />
    //     )
    // }

    submit = (e) => {
        e.preventDefault();
        axios.post('/getToken', {
            email: this.state.email,
            password: this.state.password
        }).then(res => {
            localStorage.setItem('send-jwt', res.data)
            this.props.history.push('/protected')
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit} >
                    <label>email</label><input type="text" name="email" onChange={e => this.change(e)} value={this.state.email} />
                    <label>password</label><input type="password" name="password" onChange={e => this.change(e)} value={this.state.password} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

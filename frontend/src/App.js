import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            errorMsg: ""
        }
    }

    logout() {
        this.setState({user: null});
    }

    attemptLogin() {
        let email = document.querySelector("input[name='email']").value;
        let password = document.querySelector("input[name='password']").value;

        //aici ar trebui sa ne conectam la server si sa intoarcem userul corect cu datele lui sau eroare altfel
        //dar momentan sunt hardcodati aici userii si cu datele lor de login
        if(email == "admin" && password == "admin") {
            let user = {
                id: 1,
                email: "admin",
                name: "admin",
                type: 0
            };
            this.setState({user: user, errorMsg: ""});
            return;
        }
        if(email == "jurist" && password == "jurist") {
            let user = {
                id: 2,
                email: "jurist",
                name: "jurist",
                type: 1
            };
            this.setState({user: user, errorMsg: ""});
            return;
        }

        //daca avem eroare
        this.setState({errorMsg: "Eroare: credidentiale gresite"});
    }

    renderContent() {
        if (this.state.user == null)
            return (
                <div className="content">
                    <p>Te rugam sa te loghezi.</p>
                    <div className="form">
                        <input name="email" type="text" placeholder="Email"/>
                        <input name="password" type="password" placeholder="Parola"/>
                        <div className="button" onClick={(e) => {
                            this.attemptLogin()
                        }}>Login
                        </div>
                        <p className="error">{this.state.errorMsg}</p>
                    </div>
                </div>
            );
        else {
            if (this.state.user.type == 0)
                return (
                    <div className="content">
                        <h3>
                            Esti logat ca administrator, {this.state.user.name} !
                        </h3>
                        <div className="button" onClick={(e) => {
                            this.logout()
                        }}>Logout
                        </div>
                    </div>
                );
            else
                return (
                    <div className="content">
                        <h3>
                            Esti logat ca jurist, {this.state.user.name} !
                        </h3>
                        <div className="button" onClick={(e) => {
                            this.logout()
                        }}>Logout
                        </div>
                    </div>
                );

        }
    }

    render() {
        return (
            <div className="main">
                <h1>
                    Aplicatie de jurizare
                </h1>
                {
                    this.renderContent()
                }
            </div>
        );
    }
}

import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            data: null,
            page: 0,
            errorMsg: ""
        }
    }

    logout() {
        this.setState({user: null});
    }

    attemptLogin() {
        let email = document.querySelector("input[name='email']").value;
        let password = document.querySelector("input[name='password']").value;

        //todo - login and get user
        //aici ar trebui sa ne conectam la server si sa intoarcem userul corect cu datele lui sau eroare altfel
        //dar momentan sunt hardcodati aici userii si cu datele lor de login
        if(email == "admin" && password == "admin") {
            let user = {
                id: 1,
                email: "admin",
                name: "admin",
                type: 0
            };

            //todo - get data

            let data = [
                {
                    id: 1,
                    name: "Concurs 1",
                    description: "Concurs 1 desc",
                    active: false
                },
                {
                    id: 2,
                    name: "Concurs 2",
                    description: "Concurs 2 desc",
                    active: false
                }
            ];
            this.setState({user: user, data: data, errorMsg: ""});
            return;
        }
        if(email == "jurist" && password == "jurist") {
            let user = {
                id: 2,
                email: "jurist",
                name: "jurist",
                type: 1
            };

            //todo - get data

            let data = {
              id: 1,
              name: "Concurs 1",
              description: "concurs 1 desc",
              participants: [
                  "Andrei",
                  "Catalin",
                  "Sergiu"
              ],
              content: [
                  {
                      name: "proba 1",
                      criterii: [ "criteriu 1", "criteriu 2"]
                  },
                  {
                      name: "proba 2",
                      criterii: [ "criteriu 1", "criteriu 2"]
                  }
              ]
            };
            this.setState({user: user, data: data, errorMsg: ""});
            return;
        }

        //daca avem eroare
        this.setState({errorMsg: "Eroare: credidentiale gresite"});
    }

    startStop(id){
        //todo - send data
    }

    addTest() {
        let root = document.querySelector(".contest-tests");


        let div = document.createElement('div');
        let div2 = document.createElement('div');

        let input = document.createElement('input');
        input.type = "text";
        input.name = "proba_" + root.childElementCount;
        input.value = "Proba " + root.childElementCount;

        let btn = document.createElement('div');
        btn.innerHTML = "+ Adauga criteriu";
        btn.onclick = (e) => {this.addCriteria(div)};

        div2.appendChild(input);
        div2.appendChild(btn);
        div.appendChild(div2);
        root.appendChild(div);
    }

    addCriteria(div) {
        let input = document.createElement('input');
        input.type = "text";
        input.name = "criteria_" + div.childElementCount;
        input.value = "Criteriul " + div.childElementCount;

        div.appendChild(input);
    }

    addParticipant() {
        let root = document.querySelector(".contest-participants");

        let input = document.createElement('input');
        input.type = "text";
        input.name = "participant_" + root.childElementCount;
        input.value = "Participant " + root.childElementCount;

        root.appendChild(input);
    }

    saveContest() {
        let name = document.querySelector("input[name=name]").value;
        let description = document.querySelector("input[name=description]").value;

        let content = [];
        let tests = document.querySelector(".contest-tests").getElementsByTagName('div');

        for(let i = 1; i < tests.length; i++ ) {

            if(tests[i].querySelector('div') == null)
                continue;

            if(tests[i].querySelector('div').querySelector('input') == null)
                continue;

            let name = tests[i].querySelector('div').querySelector('input').value;

            let criteria = tests[i].querySelectorAll('input');

            let criteriaNames = [];

            for(let j = 1; j < criteria.length; j++){

                if(criteria[j] == undefined)
                    continue;

                criteriaNames.push(criteria[j].value);
            }

            content.push(
                {
                    name: name,
                    criterii: criteriaNames
                }
            );

        }

        let participants = [];

        let participantsInputs = document.querySelector('.contest-participants').querySelectorAll('input');

        for(let i = 0; i < participantsInputs.length; i++){
            participants.push(participantsInputs[i].value);
        }

        console.log(name);
        console.log(description);
        console.log(content);
        console.log(participants);

        //todo - send data

        //todo - refresh state data

        //this.setState({page: 0});
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
            if (this.state.user.type == 0) {
                if(this.state.page == 0)
                    return (
                        <div className="content">
                            <h3>
                                Esti logat ca administrator, {this.state.user.name} !
                            </h3>
                            <div className="standard-btn" onClick={(e) => this.setState({page: 1}) }>
                                Adauga un concurs
                            </div>
                            <div className="contest-list">
                                {
                                    this.state.data.map((item) => {
                                        return (
                                            <div key={item.id + 1}>
                                                <span>{item.name}</span>
                                                <span>{item.description}</span>
                                                <div className={item.active ? "standard-btn red-btn" : "standard-btn green-btn"}
                                                     onClick={(e) => this.startStop(item.id)}>{item.active ? "Stop" : "Start"}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="button" onClick={(e) => {
                                this.logout()
                            }}>Logout
                            </div>
                        </div>
                    );
                else
                    return (
                        <div className="content create">
                            <h1>Creare concurs</h1>
                            Name: <input type="text" name="name"/>
                            Description: <input type="text" name="description"/>
                            <div className="contest-tests">
                                <div className="standard-btn" onClick={(e) => this.addTest()}>+ Adauga proba</div>
                            </div>
                            <div className="contest-participants">
                                <div className="standard-btn" onClick={(e) => this.addParticipant()}>+ Adauga participant</div>
                            </div>
                            <div className="standard-btn" onClick={(e) => this.saveContest() }>Salveaza concurs</div>
                        </div>
                    );
            } else
                return (
                    <div className="content">
                        <h3>
                            Concurs in desfasurare
                        </h3>
                        <div>
                            Niciun concurs in desfasurare.
                        </div>
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

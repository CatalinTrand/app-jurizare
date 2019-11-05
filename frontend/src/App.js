import React from 'react';
import logo from './logo.svg';
import './App.css';

let serverName = "http://app.jurizare/api/";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            data: null,
            viewedContest: null,
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
        if (email == "admin" && password == "admin") {
            let user = {
                id: 1,
                email: "admin",
                name: "admin",
                type: 0
            };

            //todo - get data

            let xhr = new XMLHttpRequest();
            let url = serverName + "contests";

            xhr.open("GET", url);
            xhr.send();
            let parent = this;
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    parent.setState({user: user, data: JSON.parse(this.response)[0], errorMsg: ""});
                }
            };
        }

        if (email == "jurist" && password == "jurist") {
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
                        criterii: ["criteriu 1", "criteriu 2"]
                    },
                    {
                        name: "proba 2",
                        criterii: ["criteriu 1", "criteriu 2"]
                    }
                ]
            };
            this.setState({user: user, data: data, errorMsg: ""});
            return;
        }

        //daca avem eroare
        this.setState({errorMsg: "Eroare: credidentiale gresite"});
    }

    startStop(id) {
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
        btn.onclick = (e) => {
            this.addCriteria(div)
        };

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

        for (let i = 1; i < tests.length; i++) {

            if (tests[i].querySelector('div') == null)
                continue;

            if (tests[i].querySelector('div').querySelector('input') == null)
                continue;

            let name = tests[i].querySelector('div').querySelector('input').value;

            let criteria = tests[i].querySelectorAll('input');

            let criteriaNames = [];

            for (let j = 1; j < criteria.length; j++) {

                if (criteria[j] == undefined)
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

        for (let i = 0; i < participantsInputs.length; i++) {
            participants.push(participantsInputs[i].value);
        }

        console.log(name);
        console.log(description);
        console.log(content);
        console.log(participants);

        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("contentt", JSON.stringify(content));
        formData.append("participants", JSON.stringify(participants));

        let xhr = new XMLHttpRequest();
        let url = serverName + "createContest";

        xhr.open("POST", url, true);
        xhr.send(formData);
        let parent = this;
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                parent.setState({page: 0});
            }
        }
    }

    sendGrades() {
        let grades = this.state.data.participants.map(
            participant => {
                let content = [];
                for (let i = 0; i < this.state.data.content.length; i++) {
                    let probeResult = {
                        name: this.state.data.content[i].name,
                        criterii: []
                    };
                    for (let j = 0; j < this.state.data.content[i].criterii.length; j++) {
                        let select = document.querySelector("select[name='" + participant + "_" + this.state.data.content[i].name + "_" + this.state.data.content[i].criterii[j] + "']");
                        probeResult.criterii.push(
                            {
                                name: this.state.data.content[i].criterii[j],
                                score: select.options[select.selectedIndex].text
                            }
                        )
                    }
                    content.push(probeResult);
                }
                return (
                    {
                        name: participant,
                        content: content
                    });
            }
        );

        console.log(grades);

        let formData = new FormData();
        formData.append("contest_id", this.state.data.id);
        formData.append("jury_id", "1");
        formData.append("contentt", JSON.stringify(grades));

        let xhr = new XMLHttpRequest();
        let url = serverName + "sendGrades";

        xhr.open("POST", url, true);
        xhr.send(formData);
        let parent = this;
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("sent");
            }
        }
    }

    viewResults(item) {
        this.setState({viewedContest: item});
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
                if (this.state.page == 0) {
                    if (this.state.viewedContest == null)
                        return (
                            <div className="content">
                                <h3>
                                    Esti logat ca administrator, {this.state.user.name} !
                                </h3>
                                <div className="standard-btn" onClick={(e) => this.setState({page: 1})}>
                                    Adauga un concurs
                                </div>
                                <div className="contest-list">
                                    {
                                        this.state.data.map((item) => {
                                            return (
                                                <div key={item.id + 1}>
                                                    <span>{item.name}</span>
                                                    <span>{item.description}</span>
                                                    <div
                                                        className={item.active ? "standard-btn red-btn" : "standard-btn green-btn"}
                                                        onClick={(e) => this.startStop(item.id)}>{item.active ? "Stop" : "Start"}</div>
                                                    <div className="standard-btn" onClick={(e) => {
                                                        this.viewResults(item)
                                                    }}>
                                                        View Results
                                                    </div>
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
                            <div className="content">
                                <h3>
                                    Esti logat ca administrator, {this.state.user.name} !
                                </h3>
                                <div className="standard-btn" onClick={(e) => {
                                    this.setState({viewedContest: null})
                                }}>Inapoi la lista
                                </div>
                                <div className="content jury">
                                    <h3>Afisare rezultate pentru concursul: {this.state.viewedContest.name}</h3>
                                    <p>{this.state.viewedContest.description}</p>
                                    <div className="contestants">
                                        {
                                            JSON.parse(this.state.viewedContest.participants).map(
                                                (participant, index) => {
                                                    return (
                                                        <div>
                                                            <h4>{participant}</h4>
                                                            {
                                                                JSON.parse(this.state.viewedContest.content).map(
                                                                    (test, index2) => {
                                                                        return (
                                                                            <div className="contest-test">
                                                                                <span>{test.name}</span>
                                                                                {
                                                                                    test.criterii.map(
                                                                                        (criteria, index3) => {
                                                                                            return (
                                                                                                <div>
                                                                                                    <span>{criteria}</span>
                                                                                                    <span>{this.state.viewedContest.results[index].content[index2].scores[index3]}</span>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                } else if (this.state.page == 1)
                    return (
                        <div className="content create">
                            <h1>Creare concurs</h1>
                            Nume: <input type="text" name="name"/>
                            Descriere: <input type="text" name="description"/>
                            <div className="contest-tests">
                                <div className="standard-btn" onClick={(e) => this.addTest()}>+ Adauga proba</div>
                            </div>
                            <div className="contest-participants">
                                <div className="standard-btn" onClick={(e) => this.addParticipant()}>+ Adauga
                                    participant
                                </div>
                            </div>
                            <div className="standard-btn" onClick={(e) => this.saveContest()}>Salveaza concurs</div>
                        </div>
                    );
                else {
                    return (
                        <div className="content see-result">
                            <h4>Results for contest {}</h4>
                        </div>
                    );
                }
            } else
                return (
                    <div className="content">
                        <h3>
                            Concurs in desfasurare
                        </h3>
                        {
                            this.state.data == null ?
                                <div>
                                    Niciun concurs in desfasurare.
                                </div> :
                                <div className="content jury">
                                    <h3>Concurs in desfasurare: {this.state.data.name}</h3>
                                    <p>{this.state.data.description}</p>
                                    <div className="contestants">
                                        {
                                            this.state.data.participants.map(
                                                (participant) => {
                                                    return (
                                                        <div>
                                                            <h4>{participant}</h4>
                                                            {
                                                                this.state.data.content.map(
                                                                    (test) => {
                                                                        return (
                                                                            <div className="contest-test">
                                                                                <span>{test.name}</span>
                                                                                {
                                                                                    test.criterii.map(
                                                                                        criteria => {
                                                                                            return (
                                                                                                <div>
                                                                                                    <span>{criteria}</span>
                                                                                                    <select
                                                                                                        name={participant + "_" + test.name + "_" + criteria}>
                                                                                                        <option>1</option>
                                                                                                        <option>2</option>
                                                                                                        <option>3</option>
                                                                                                        <option>4</option>
                                                                                                        <option>5</option>
                                                                                                        <option>6</option>
                                                                                                        <option>7</option>
                                                                                                        <option>8</option>
                                                                                                        <option>9</option>
                                                                                                        <option>10</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )
                                        }
                                    </div>
                                    <div className="standard-btn" onClick={(e) => this.sendGrades()}>Trimite note</div>
                                </div>
                        }
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

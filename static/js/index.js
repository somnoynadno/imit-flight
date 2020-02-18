'use strict';

const g = 9.81;
const C = 0.15;
const rho = 1.29;

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(main);

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function drawChart(dots) {
    var data = google.visualization.arrayToDataTable(dots);

    var options = {
        title: 'Deterministic model',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-container'));

    chart.draw(data, options);
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.divStyle = {
            overflowX: "scroll",
            overflowY: "hidden",    
            width: "100%",
            height: "500px"
        };
    }

    render() {
        return (
            <div id="graph-container" className="row" style={this.divStyle}></div>
        )
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.launch = this.props.launch.bind(this);
        this.stop = this.props.stop.bind(this);
    }

    render() {
        return (
            <div className="row mt-2">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="height">Height</label>
                        <input type="text" className="form-control form-control-sm" id="height" />
                        <label htmlFor="angle">Angle</label>
                        <input type="text" className="form-control form-control-sm" id="angle" />
                        <label htmlFor="speed">Speed</label>
                        <input type="text" className="form-control form-control-sm" id="speed" />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="size">Size</label>
                        <input type="text" className="form-control form-control-sm" id="size" />
                        <label htmlFor="weight">Weight</label>
                        <input type="text" className="form-control form-control-sm" id="weight" />
                        <label htmlFor="use-atmosphere">Atmosphere? </label>
                        <input type="checkbox" className="form-check-label ml-2 mt-2" id="use-atmosphere" />
                    </div>
                </div>
                <div className="col">
                    <div className="btn btn-primary mb-2" onClick={this.launch}>
                        Launch
                    </div>
                    <div className="btn btn-secondary ml-2 mb-2" onClick={this.stop}>
                        Stop
                    </div>
                </div>
            </div>
        )
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <h3>Time: {this.props.time + "s"}</h3>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {time: 0}
        this.dt = 0.1;
        this.x0 = 0;

        this.interval = null;
        this.dots = [["X", "Y"]];
    }

    launch() {
        this.y0 =  Number($('#height').val());
        this.ang = Number($('#angle').val());
        this.v0 =  Number($('#speed').val());
        this.S =   Number($('#size').val());
        this.m =   Number($('#weight').val());

        this.useAtmosphere = $("#use-atmosphere").prop("checked");

        this.interval = setInterval(() => this.tick(), 1000 * this.dt);
    }

    tick() {
        let x = this.x0 + this.v0*Math.cos(toRadians(this.ang))*this.state.time;
        let y = this.y0 + this.v0*Math.sin(toRadians(this.ang))*this.state.time - g*this.state.time*this.state.time/2;

        this.dots.push([x, y]);
        drawChart(this.dots);
        this.setState({time: this.state.time + this.dt})

        if (y <= 0) {
            this.stop();
        }
    }

    stop() {
        clearInterval(this.interval);
        this.setState({time: 0});
    }

    render() {
        return (
            <div>
                <h1>Flight</h1>
                <Menu 
                    launch={this.launch.bind(this)}
                    stop={this.stop.bind(this)}
                />
                <Timer
                    time={this.state.time}
                />
                <Graph />
            </div>
        )
    }
}

function main() {
    ReactDOM.render(
        <Game />,
        document.getElementById('container')
    );
}
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
                <h3 className="ml-2">Time: {Math.round(this.props.time * 100) / 100 + "s"}</h3>
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
        let paramsAreValid = true;

        this.y0 =  Number($('#height').val());
        this.ang = Number($('#angle').val());
        this.v0 =  Number($('#speed').val());

        if (isNaN(this.y0) || isNaN(this.ang) || isNaN(this.v0))
            paramsAreValid = false;

        this.useAtmosphere = $("#use-atmosphere").prop("checked");

        this.vx = this.v0*Math.cos(toRadians(this.ang));
        this.vy = this.v0*Math.sin(toRadians(this.ang));

        if (this.useAtmosphere) {
            this.x = this.x0;
            this.y = this.y0;

            this.S = Number($('#size').val());
            this.m = Number($('#weight').val());

            if (isNaN(this.S) || isNaN(this.m))
                paramsAreValid = false;

            this.k = 0.5 * C * rho * this.S / this.m;
        }

        if (paramsAreValid) {
            document.getElementById('graph-container').innerHTML = '';
            this.interval = setInterval(() => this.tick(), 1000*this.dt);
        }
    }

    tick() {
        if (this.useAtmosphere){
            let v = Math.sqrt(this.vx*this.vx + this.vy*this.vy);

            this.vx = this.vx - this.k*this.vx*v*this.dt;
            this.vy = this.vy - (g + this.k*this.vy*v)*this.dt;

            this.x = this.x + this.vx*this.dt;
            this.y = this.y + this.vy*this.dt;
        } else {
            this.x = this.x0 + this.vx*this.state.time;
            this.y = this.y0 + this.vy*this.state.time - g*this.state.time*this.state.time/2;
        }

        this.dots.push([this.x, this.y]);
        this.setState({time: this.state.time + this.dt})

        if (this.y <= 0) {
            this.stop();
        } else {
            drawChart(this.dots);
        }
    }

    stop() {
        clearInterval(this.interval);
        this.setState({time: 0});
        this.dots = [["X", "Y"]];
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
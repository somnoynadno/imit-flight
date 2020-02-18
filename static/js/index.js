'use strict';

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(main);

function drawChart(dots) {
    var data = google.visualization.arrayToDataTable(dots);

    var options = {
        title: 'Exchange rate',
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
                            <input type="checkbox" className="form-check-label ml-2" id="use-atmosphere" />
                        </div>
                    </div>
                    <div className="col">
                        <div className="btn btn-primary mb-2">
                            Launch
                        </div>
                        <div className="btn btn-secondary ml-2 mb-2">
                            Pause
                        </div>
                    </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    launch() {

    }

    render() {
        return (
            <div>
                <h1>Flight</h1>
                <Menu />
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
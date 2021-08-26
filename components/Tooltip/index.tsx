import React, { RefObject, Component } from 'react';
import {connect} from 'react-redux';
import { getColorFunc } from "../../helpers/config";
import { select } from 'd3-selection';
import * as d3 from 'd3';


interface TooltipProps {
    getColor?: getColorFunc;
    tooltip?;
    attachTooltip;
}

class Tooltip extends Component<TooltipProps> {
    tooltipRef: RefObject<HTMLDivElement>;
    Tooltip: any;

    constructor(props) {
        super(props);
        this.tooltipRef = React.createRef();
    }

    show(): any {
        this.Tooltip.style("display", "block").style("opacity", 1)
    };
    hide(): any {
        this.Tooltip.style("opacity", 0).style("display", "none")
    };

    data(d): any {
        let title = `<div class="title">${d.parent.parent.data.name} - ${d.parent.data.name}</div>`,
            genItemline = (d, title?: string | boolean) => {
                let descriptionField = d.data.description || "",
                    nameField = d.data.name || d.data.id || "",
                    subTitle = title ? `<div class="row"><span>${descriptionField.replace(/_DESCRIPTION/, "")}</span></div>` : "",
                    bgCol = title ? `style="background-color: ${this.props.getColor(d.data.rate)}"` : "";
                return `<div class="${title ? "item-title" : "item-line"}" ${bgCol}>
  <div class="row">
    <div class="col">${nameField.replace(/_NAME/, "")}</div>
    <div class="col"><svg width="45" height="24" class="item-chart" data-id="${d.rectUid}"><g/></svg></div>
    <div class="col">${d.data.value || "N/A"}</div>
    <div class="col">${d.data.rate ? d.data.rate.toFixed(2) + "%" : "N/A"}</div>
  </div>${subTitle}
</div>`;
            },
            itemTitle = genItemline(d, true),
            itemLines = "";
        for (let i = 0; i < d.parent.children.length; i++) {
            let _item = d.parent.children[i];
            itemLines += genItemline(_item);
        }
        this.Tooltip.html(`${title}${itemTitle}${itemLines}`);
        // this.createChart(d);
        for (let i = 0; i < d.parent.children.length; i++) {
            let _item = d.parent.children[i];
            this.createChart(_item);
        }
    };

    createChart(d): any {
        if (!d.data.chart) return false;
        let svg = d3.selectAll(`svg.item-chart[data-id="${d.rectUid}"]`),
            _width: number = parseInt(svg.attr('width')),
            _height: number = parseInt(svg.attr('height')),
            _chart: number[] = d.data.chart.reduce(function (prev, curr, idx) {
                prev.push({
                    key: idx,
                    value: curr,
                });
                return prev;
            }, []);
        let _x = d3.scaleLinear()
            .range([0, _width]);

        let _y = d3.scaleLinear()
            .range([_height, 0]);

        let _line = d3.line()
            .x(function(d) { return _x(d["key"]); })
            .y(function(d) { return _y(d["value"]); });

        _x.domain(d3.extent(_chart, function(d) { return d["key"]; }));
        _y.domain(d3.extent(_chart, function(d) { return d["value"]; }));

        svg.append("path")
            .datum(_chart)
            .attr("class", "line")
            // @ts-ignore
            .attr("d", _line);
    };

    componentDidUpdate(prevProps: Readonly<TooltipProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.props.tooltip && Object.keys(this.props.tooltip).length) {
            this.data(this.props.tooltip);
            this.show();
        } else {
            this.hide();
        }
        if (this.Tooltip) this.props.attachTooltip(this.Tooltip);
    }

    componentDidMount(): void {
        this.Tooltip = select(this.tooltipRef.current);
        this.props.attachTooltip(this.Tooltip);
    }

    render() {
        return (
            <div className="tooltip" ref={this.tooltipRef} />
        );
    }
}

const mapStateToProps = state => ({
    tooltip: state.tooltip
});

export default connect(mapStateToProps)(Tooltip);

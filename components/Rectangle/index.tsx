import React, { Component, RefObject } from 'react';
import {connect} from 'react-redux';
import {BaseType, select, Selection} from 'd3-selection';
import * as config from "../../helpers/const";
import { getColorFunc, DOM } from "../../helpers/config";
import { IData, IItemsData, IGroupsData, ISubGroupsData } from "../../helpers/interfaces";
import { setDataTooltip, clearDataTooltip } from "../../redux/actions/actionCreators";
import * as d3 from 'd3';
import { HierarchyNode } from "d3-hierarchy";


interface RectangleProps {
    d3Params: {
        root: HierarchyNode<IData | IGroupsData | ISubGroupsData | IItemsData>,
        rates,
        colorDomains,
        getColor
    };
    fromApi?;
    updTooltip?;
}

class Rectangle extends Component<RectangleProps> {
    rectRef: RefObject<SVGSVGElement>;
    getColor: getColorFunc;
    zoom: number;

    constructor(props) {
        super(props);
        this.rectRef = React.createRef();
        this.zoom = 0;
        this.mouseover = this.mouseover.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mouseleave = this.mouseleave.bind(this);
    }

    mouseover = function(event, d): void | boolean {
        if (d.depth === 3) {
            this.props.dispatch(setDataTooltip(d));
        }

        if (d.depth <= 2) return false;

        let g: Selection<BaseType, unknown, HTMLElement, any> = d3.select(event.currentTarget);
        if (g.attr("parent-id")) {
            g = d3.select(`#${g.attr("parent-id")}`);
        }
        let n = g.select('.the-node');

        n.transition().duration(400)
            .style('fill', "rgba(255,235,5,0.8)" );
    };

    mousemove = function(event, d):void {
        if (d.depth === 3) {
            this.props.updTooltip(event);
        }
    };

    mouseleave = function(event, d): void | boolean {
        if (d.depth === 3) {
            this.props.dispatch(clearDataTooltip());
        }
        if (d.depth <= 2) return false;

        let g: Selection<BaseType, unknown, HTMLElement, any> = d3.select(event.currentTarget);
        if (g.attr("parent-id")) {
            g = d3.select(`#${g.attr("parent-id")}`);
        }
        let n = g.select('.the-node');

        n.transition().duration(400)
            .style('fill', "rgba(0,0,0,0.2)" );
    };

    draw(): any {
        const { root, colorDomains, getColor } = this.props.d3Params;
        let body;

        if (this.props.fromApi) {
            body = select(document).select("body");
        }
        let svg = body ? body.append("svg") : select(this.rectRef.current);
        svg = svg.attr("width", config.width + config.margin.left + config.margin.right)
            .attr("height", config.height + config.margin.top + config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`);

        d3.treemap()
            .size([config.width, config.height])
            .paddingOuter(4)
            .paddingTop(20)
            .paddingInner(2)
            .tile(d3.treemapSquarify)
            .round(true)
            (root);

        this.getColor = getColor;

        if (!this.props.fromApi) {
            const zoom = d3.zoom()
                .scaleExtent([1, 4])
                .extent([[config.margin.left, config.margin.top], [config.margin.left + config.width, config.margin.top + config.height]])
                .translateExtent([[config.margin.left, config.margin.top], [config.margin.left + config.width, config.margin.top + config.height]])
                .on("zoom", (event) => {
                    for (let i = 0; i < config.stepsZoom.length; i++) {
                        let stepZoom = config.stepsZoom[i];
                        if (event.transform.k === stepZoom) {
                            this.zoom = i;
                        } else if (event.transform.k > stepZoom) {
                            this.zoom = i + 1;
                        }
                    }
                    svg.attr("transform", event.transform)
                });
            svg.call(zoom);
            d3.select("#zoom_in").on("click", () => {
                if (this.zoom < config.stepsZoom.length) {
                    this.zoom += 1;
                    zoom.scaleBy(svg.transition().duration(500), config.stepsZoom[this.zoom]);
                }
            });
            d3.select("#zoom_out").on("click", () => {
                if (this.zoom > 0) {
                    this.zoom = this.zoom - 1;
                    zoom.scaleTo(svg.transition().duration(500), config.stepsZoom[this.zoom]);
                }
            });
        }

        // @ts-ignore
        const items = svg
            .selectAll("g")
            .data(d3.group(root, d => d.depth, d => d.height))
            .enter()
            .selectAll("g")
            .data(d => d[1])
            .enter()
            .selectAll("g")
            .data(d => d[1])
            .enter()
            .append("g")
            .attr("id", d => (d["nodeUid"] = DOM.uid("node")).id)
            .attr("parent-id", d => {
                if (d.depth === 3) {
                    return d.parent["nodeUid"].id;
                }
            })
            .attr('class', d => d.depth === 0 ? "node group" : "node subgroup")
            .attr('transform', d => 'translate('+[d["x0"], d["y0"] - 20]+')')
            .on("mouseover", this.mouseover)
            .on("mousemove", this.mousemove)
            .on("mouseleave", this.mouseleave);

        // @ts-ignore
        items
            .append('rect')
            .classed('the-node', true)
            .attr("id", d => (d["rectUid"] = DOM.uid("rect")).id)
            .attr("width", d => (d["rectWidth"] = d["x1"] - d["x0"]))
            .attr("height", d => (d["rectHeight"] = d["y1"] - d["y0"]))
            .style("fill", (d) => {
                if (d.depth === 3) {
                    // @ts-ignore
                    return this.getColor(d.data.rate);
                } else if (d.depth === 2) {
                    return "rgba(0,0,0,0.2)"
                } else {
                    return "rgba(255,255,255,1)"
                }
            });

        items.append("clipPath")
            .attr("id", d => (d["clipUid"] = DOM.uid("clip")).id)
            .append("use")
            .attr("xlink:href", d => d["rectUid"].href);

        // @ts-ignore
        items
            .append('text')
            .attr("clip-path", d => d["clipUid"])
            .attr('dx', d => d.depth === 1 ? 6 : 2)
            .attr('dy', () => 15)
            .selectAll('tspan')
            .data(d => {
                return [d.data];
            })
            .join('tspan')
            .attr('class', 'label')
            .attr('fill', d => !d.items && !d.subgroups && !d.groups ? "#fff" : "#000")
            .text( d => {
                // @ts-ignore
                return d.name ? d.name.replace(/_NAME/, "") : "";
            });

        // @ts-ignore
        items
            .append('text')
            .attr("clip-path", d => d["clipUid"])
            .attr('dx', () => 2)
            .attr('dy', () => 28)
            .selectAll('tspan')
            .data(d => {
                if (!d.children) {
                    // @ts-ignore
                    return [d.data.rate ? d.data.rate.toFixed(2) + "%" : "N/A"];
                } else {
                    return [];
                }
            })
            .join('tspan')
            .attr('class', 'label')
            .attr('fill', d => d ? "#fff" : "#000")
            .text( d => d);

        items
            .selectAll("text")
            .attr('class', function (d) {
                // @ts-ignore
                if (this.getBBox) {
                    let _item = this.getBBox();
                    return ((_item.x + _item.width) > d["rectWidth"]) || ((_item.y + _item.height) > d["rectHeight"]) ? "d-none" : "";
                } else {
                    return "";
                }
            });

        items.call(() => d3.select(".preloader").attr("class", "preloader loaded"));

        if (this.props.fromApi) {
            return body.select("svg > g").node().innerHTML;
        }
    }

    componentDidMount(): void {
        this.draw();
    }

    render() {
        if (this.props.fromApi) {
            return (<svg className="Rectangle" width={config.width + config.margin.left + config.margin.right} height={config.height + config.margin.top + config.margin.bottom} ref={this.rectRef} dangerouslySetInnerHTML={{ __html: this.draw() }} />);
        } else {
            return (<svg className="Rectangle" ref={this.rectRef} />);
        }
    }
}

const mapStateToProps = state => ({
    tooltip: state.tooltip
});

export default connect(mapStateToProps)(Rectangle);

import * as params from "./const";
import * as d3 from 'd3';

export const getColorDomains = (rates: number[]): number[] => {
    let minRate = Math.min.apply(this, rates),
        maxRate = Math.max.apply(this, rates);
    minRate = Math.abs(minRate);
    maxRate = Math.max(minRate, maxRate);
    maxRate = Math.round(maxRate);
    minRate = -1 * maxRate;
    return [minRate, maxRate];
};

export type getColorFunc = (_rate:number) => string;

export const getColorFn = (colorDomains: number[]): getColorFunc => {
    const _colors = colorDomains[1] > 2 ? params.redGreenGradient.colors : colorDomains[1] > 1 ? params.redGreenGradientSmall.colors : params.redGreenGradientXSmall.colors;
    const color = d3.scaleLinear()
        .domain(colorDomains)
        .range([0, _colors.length - 1]);

    return (_rate: number): string => {
        if (typeof _rate === "undefined") {
            return params.redGreenGradient.nullColor;
        }
        _rate = _rate || 0;
        if (_rate > colorDomains[1]) _rate = colorDomains[1];
        if (_rate < colorDomains[0]) _rate = colorDomains[0];
        let _colIdx = color(_rate);
        return _colors[Math.round(_colIdx)];
    };
};

export const DOM = {
    count: 0,
    uid: function (name) {
        function Id(id) {
            this.id = id;
            // @ts-ignore
            this.href = new URL(`#${id}`, location) + "";
        }
        Id.prototype.toString = function() {
            return "url(" + this.href + ")";
        };
        return new Id("O-" + (name == null ? "" : name + "-") + ++DOM.count);
    },
};

export function D3Params (data) {
    function Ind3Params (data) {
        this.root = d3.hierarchy(data, (d) => d.groups || d.subgroups || d.items)
            .sum(function(d){ return d.weight || 1})
            .sort((a, b) => b.value - a.value);

        this.rates = this.root.descendants().reduce((prev, curr) => {
            if (curr.data.rate) {
                prev.push(curr.data.rate);
            }
            return prev;
        }, []);
        const weights = this.root.descendants().reduce((prev, curr) => {
            if (curr.data.weight) {
                prev.push(curr.data.weight);
            }
            return prev;
        }, []);
        this.colorDomains = getColorDomains(this.rates);
        this.weightDomains = getColorDomains(weights);
        this.getColor = getColorFn(this.colorDomains);
    }
    return new Ind3Params(data);
}

export function TooltipUpd () {
    return (function () {
        function InstTooltipUpd () {
            this.instTooltip = {};
        }
        InstTooltipUpd.prototype.attachTooltip = function (elem) {
            this.instTooltip = elem;
        };
        InstTooltipUpd.prototype.updTooltip = function (event) {
            if (!this.instTooltip && !this.instTooltip.style) return false;
            let _width = parseInt(this.instTooltip.style("width")),
                _height = parseInt(this.instTooltip.style("height")),
                _offset = 50,
                _innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
                _innerHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
                _left = (event.pageX + _offset + _width) > _innerWidth ? event.pageX - _offset - _width : event.pageX + _offset,
                _top = (event.pageY + _offset + _height) > _innerHeight ? event.pageY - (_height - (_innerHeight - event.pageY)) - 4 : event.pageY;
            this.instTooltip
                .style("left", _left + "px")
                .style("top", _top + "px");
        };

        return new InstTooltipUpd();
    })();
}

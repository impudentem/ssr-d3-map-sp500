import React from "react";
import ReactDOMServer from "react-dom/server";

import Rectangle from '../../components/Rectangle';
import { wrapper } from "../../redux/store";
import { D3Params } from "../../helpers/config";
import {
  DOMParser
} from 'xmldom';
import * as canvas from 'canvas';
import fetch from 'node-fetch';
import Canvg, {
  presets
} from 'canvg';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const preset = presets.node({
    DOMParser,
    canvas,
    fetch
  });
  const { document, location, SVGElement } = (new JSDOM('')).window;
  global.document = document;
  global.location = location;
  global.SVGElement = SVGElement;

  const resData = await fetch('https://api.marketviz.io/heatmap/SP500');
  const data = await resData.json();
  const d3Params = D3Params(data);
  const svg = ReactDOMServer.renderToString(React.createElement(wrapper.withRedux(Rectangle), {d3Params: d3Params, fromApi: true}));

  const canvasElm = preset.createCanvas(1200, 630);
  const ctx = canvasElm.getContext('2d');
  ctx.antialias = "subpixel";
  ctx.quality = "best";

  const v = Canvg.fromString(ctx, svg, preset);
  await v.render();
  const png = canvasElm.toBuffer();

  res
    .status(200)
    .setHeader("Content-Length", `${png.byteLength}`)
    .setHeader("Content-Type", "image/png")
    .send(png);
  // res.setPreviewData({});

  // res.end(svg)
}

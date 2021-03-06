import React from "react";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Rectangle from '../components/Rectangle';
import Tooltip from '../components/Tooltip';
import Dropdown from '../components/Dropdown';
import { wrapper } from "../redux/store";
import { D3Params, TooltipUpd } from "../helpers/config";
import {OverlayTrigger, Tooltip as BSTooltip} from "react-bootstrap";


const Home = ({ data, query, ...ext }) => {
    const d3Params = D3Params(data);
    let legendArr = new Array(7);
    for (let idx = 0; idx < legendArr.length; idx++) {
        let addInt = d3Params.colorDomains[1] / 3;
        legendArr[idx] = d3Params.colorDomains[0] + addInt * idx;
    }
    const tooltipUpd = TooltipUpd();

    return (
        <div>
            <Head>
                <title>D3 SP500 (NextJS)</title>
                <link rel="icon" href={"/favicon.ico"} />
            </Head>

            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid justify-content-start">
                    <span className="fs-4 navbar-brand mb-0 h1">{data.title ? data.title : 'Navbar'}</span>
                    <Dropdown slug={query.slug}/>
                    <div className="btn-group me-3" role="group" aria-label="Zoom">
                        <button type="button" className="btn btn-outline-info" id="zoom_in"><i className="bi bi-zoom-in"/></button>
                        <button type="button" className="btn btn-outline-info" id="zoom_out"><i className="bi bi-zoom-out"/></button>
                    </div>
                    <a className="btn p-0" href={"https://www.facebook.com/sharer/sharer.php?u=http://ssr-d3-map-sp500.herokuapp.com/share"} target={"_blank"} rel={"noreferrer"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="105" height="33" fill="currentColor"
                             className="bi bi-share" viewBox="0 0 122.88 38.48">
                            <defs>
                                <style>{`.cls-1{fill:#1877f2;fill-rule:evenodd}.cls-2{fill:#fff}.cls-3{fill:#166bda}`}</style>
                            </defs>
                            <title>Share to facebook</title>
                            <path
                                d="M118.69 0H4.19A4.21 4.21 0 0 0 0 4.19v30.1a4.2 4.2 0 0 0 4.19 4.19h114.5a4.2 4.2 0 0 0 4.19-4.19V4.19A4.21 4.21 0 0 0 118.69 0z"
                                className="cls-1"/>
                            <path
                                d="M52 21.34l3.13-.23a3 3 0 0 0 .42 1.34 1.65 1.65 0 0 0 1.45.75 1.45 1.45 0 0 0 1.09-.38 1.24 1.24 0 0 0 .38-.89 1.21 1.21 0 0 0-.36-.86 3.82 3.82 0 0 0-1.68-.72 6.73 6.73 0 0 1-3.09-1.5 3.22 3.22 0 0 1-.94-2.39 3.57 3.57 0 0 1 .48-1.8 3.38 3.38 0 0 1 1.43-1.34 6 6 0 0 1 2.63-.48 4.81 4.81 0 0 1 3.12.88 4 4 0 0 1 1.27 2.82l-3.1.21a2.07 2.07 0 0 0-.52-1.23 1.52 1.52 0 0 0-1.09-.38 1.24 1.24 0 0 0-.87.28.94.94 0 0 0-.29.69.72.72 0 0 0 .24.53 2.35 2.35 0 0 0 1.1.46 12.27 12.27 0 0 1 3.09 1.1 3.38 3.38 0 0 1 1.36 1.37 3.92 3.92 0 0 1 .43 1.83 4.37 4.37 0 0 1-.57 2.2 3.78 3.78 0 0 1-1.59 1.53 5.69 5.69 0 0 1-2.56.51c-1.82 0-3.08-.4-3.77-1.21A5.15 5.15 0 0 1 52 21.34zm11.14-8.29h3.3v4.32H70v-4.32h3.31v12.39H70v-5h-3.6v5h-3.3V13.05zm19 10.34h-3.77l-.54 2.05h-3.37l4-12.39h3.61l4 12.39h-3.43l-.54-2.05zm-.69-2.68l-1.17-4.45-1.17 4.45zm5.77 4.73V13.05h5.5a7 7 0 0 1 2.33.3 2.6 2.6 0 0 1 1.31 1.13 3.84 3.84 0 0 1 .49 2 3.93 3.93 0 0 1-.38 1.78 3.25 3.25 0 0 1-1 1.22 3.61 3.61 0 0 1-1.16.49 2.9 2.9 0 0 1 .86.46 3.81 3.81 0 0 1 .52.65 5 5 0 0 1 .46.77l1.61 3.58H94l-1.76-3.78a3 3 0 0 0-.6-1 1.25 1.25 0 0 0-.81-.28h-.29v5zm3.31-7.36h1.39a4.59 4.59 0 0 0 .88-.17.83.83 0 0 0 .53-.39 1.27 1.27 0 0 0 .21-.72 1.22 1.22 0 0 0-.33-.92 1.75 1.75 0 0 0-1.23-.32h-1.49v2.52zm8.24-5h8.83v2.64H102v2h5.12v2.52H102v2.44h5.68v2.81h-9V13.05z"
                                className="cls-2"/>
                            <path d="M40.66 0v38.48h-2.39V0h2.39z" className="cls-3"/>
                            <path
                                d="M31.43 18.75a12.18 12.18 0 1 0-14.07 12v-8.49h-3.11v-3.51h3.11v-2.68c0-3.05 1.81-4.74 4.59-4.74a17.55 17.55 0 0 1 2.71.25v3h-1.53a1.78 1.78 0 0 0-2 1.91v2.28h3.39L24 22.25h-2.87v8.51a12.14 12.14 0 0 0 10.3-12z"
                                className="cls-2"/>
                        </svg>
                    </a>
                </div>
            </nav>

            <main className="main">
                <Rectangle d3Params={d3Params} updTooltip={(e) => tooltipUpd.updTooltip(e)} fromApi={false} />
                <Tooltip getColor={d3Params.getColor} attachTooltip={(e) => tooltipUpd.attachTooltip(e)} />
            </main>
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col">
                        <p className="align-items-center d-flex m-0"><i className="bi bi-info-circle-fill me-1 fs-5"/><small>Use mouse wheel to zoom in and out. Drag zoomed map to pan it.</small></p>
                    </div>
                    <div className="col-md-auto d-flex">
                        {legendArr.map((leg, index) => (
                            <OverlayTrigger key={index} placement="top" overlay={<BSTooltip id={`legend-tooltip-${index}`}>Color indicates monthly stock performance in percent. Based on the color you can identify losers (red), neutral (black), and gainers (green).</BSTooltip>}>
                                <p className="m-0 p-2 pe-3 ps-3" style={{backgroundColor: d3Params.getColor(leg)}}><small className="text-white">{`${leg}%`}</small></p>
                            </OverlayTrigger>
                        ))}
                    </div>
                </div>
            </div>
            <div className={"preloader"}>
                <div className={"preloader-orbit-loading"}>
                    <div className={"cssload-inner cssload-one"}/>
                    <div className={"cssload-inner cssload-two"}/>
                    <div className={"cssload-inner cssload-three"}/>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store =>
    async (ctx: GetServerSidePropsContext) => {
        const { slug } = ctx.query;
        const res = await fetch(`https://api.marketviz.io/heatmap/SP500?performance=${slug[0]}`);
        const data = await res.json();

        return { props: { data } }
    }
);


export default Home;

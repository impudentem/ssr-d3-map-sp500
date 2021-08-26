import React from "react";
import Head from 'next/head';
import Rectangle from '../components/Rectangle';
import Tooltip from '../components/Tooltip';
import { wrapper } from "../redux/store";
import { D3Params, TooltipUpd } from "../helpers/config";


const Home = ({ data }) => {
    const d3Params = D3Params(data);
    const tooltipUpd = TooltipUpd();
    return (
        <div>
            <Head>
                <title>D3 SP500 (NextJS)</title>
                <link rel="icon" href="/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous" />
            </Head>

            <main className="main">
                <Rectangle d3Params={d3Params} updTooltip={(e) => tooltipUpd.updTooltip(e)} />
                <Tooltip getColor={d3Params.getColor} attachTooltip={(e) => tooltipUpd.attachTooltip(e)} />
            </main>
        </div>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async (ctx) => {
        const res = await fetch('https://api.marketviz.io/heatmap/SP500');
        const data = await res.json();

        return { props: { data } }
    }
);


export default Home;

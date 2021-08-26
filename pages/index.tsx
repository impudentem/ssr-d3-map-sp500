import React from "react";
import Head from 'next/head';
import Rectangle from '../components/Rectangle'
import Tooltip from '../components/Tooltip'
import * as config from "../helpers/const";
import { wrapper } from "../redux/store";
import { D3Params, TooltipUpd } from "../helpers/config";


const Home = ({ data }) => {
    const d3Params = D3Params(config.data);
    const tooltipUpd = TooltipUpd();
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous" />
            </Head>

            <main className="main">
                <Rectangle data={data} d3Params={d3Params} updTooltip={(e) => tooltipUpd.updTooltip(e)} />
                <Tooltip getColor={d3Params.getColor} attachTooltip={(e) => tooltipUpd.attachTooltip(e)} />
            </main>
        </div>
    );
};

// Home.getInitialProps = wrapper.getInitialPageProps(store => (ctx) => store);

// export const getStaticProps = (context) => {
//     return { props: {} };
// };
// export const getStaticProps = wrapper.getStaticProps(store => () => store);

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async (ctx) => {
        // console.log('2. Page.getServerSideProps uses the store to dispatch things');
        // store.dispatch({type: 'TICK', payload: 'was set in other page'});
        const res = await fetch('https://api.marketviz.io/heatmap/SP500');
        const data = await res.json();

        return { props: { data } }
    }
);

// export async function getServerSideProps() {
//     // Fetch data from external API
//     const res = await fetch('https://api.marketviz.io/heatmap/SP500');
//     const data = await res.json();
//
//     // Pass data to the page via props
//     return { props: { data } }
// }

export default Home;

import React from "react";
import Head from 'next/head';

const Share = () => {
    return (<div>
        <Head>
            <title>D3 SP500 (NextJS)</title>
            <meta property="og:site_name" content="SSR SP500" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Заголовок шера" />
            <meta property="og:description" content="Описание шера" />
            <meta property="og:image" content="/api/og.png" />

            <script type="text/javascript">
                // window.location.replace("/");
            </script>
        </Head>
        <main className="main"/>
    </div>);
};

export default Share;

export const getStaticProps = () => {
    return { props: {} }
};

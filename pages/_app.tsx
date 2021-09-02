import React, { useEffect } from "react";
import App, {AppInitialProps} from 'next/app';
import {wrapper} from '../redux/store';
import {SSRProvider} from "@restart/ui/ssr";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/globals.css';
import "../styles/preloader.css";

class MyApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(store => async ({Component, ctx}) => {
    // @ts-ignore
    return {
      pageProps: {
        // Call page-level getInitialProps
        // DON'T FORGET TO PROVIDE STORE TO PAGE
        // @ts-ignore
        ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store}) : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname,
      },
    };

  });

  render() {
    //pageProps that were returned  from 'getInitialProps' are stored in the props i.e. pageprops
    const {Component, pageProps} = this.props;

    return (
        <SSRProvider>
          <Component {...pageProps}/>
        </SSRProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);

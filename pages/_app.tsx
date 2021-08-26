import React from "react";
import App, {AppInitialProps} from 'next/app';
// import { Provider } from 'react-redux';
// import { wrapper } from '../redux/store';
// import { AppProps /*, AppContext */ } from 'next/app';
// import withRedux from "next-redux-wrapper";
import {wrapper} from '../redux/store';
import '../styles/globals.css'


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
        <Component {...pageProps}/>
    );
  }
};

//makeStore function that returns a new store for every request
// const makeStore = () => store;

//withRedux wrapper that passes the store to the App Component
// export default withRedux(makeStore)(MyApp);

// export default MyApp;

export default wrapper.withRedux(MyApp);

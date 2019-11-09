import React from 'react'
import App from 'next/app'
import { PageTransition } from 'next-page-transitions'

import 'styles/main.scss'

class AWSImageUpload extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    let urlProps = {}

    const { req, pathname, query } = ctx

    if (req) {
      const { host } = req.headers
      const protocol = 'https:'

      urlProps.host = `${protocol}//${host}`
      urlProps.url = `${protocol}//${host}${pathname}`
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, urlProps }
  }

  render () {
    const { Component, pageProps, urlProps, reduxStore, router } = this.props

    return (
      <PageTransition
        timeout={300}
        classNames="page-transition"
      >
        <Component {...pageProps} key={router.route}/>
      </PageTransition>
    )
  }
}

export default AWSImageUpload

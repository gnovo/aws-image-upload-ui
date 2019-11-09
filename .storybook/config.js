import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { setConfig } from 'next/config'

setConfig({
  publicRuntimeConfig: {}
})

// Apply style from project
import '../src/styles/main.scss'

// Add global wrapper for the i18next HOC
import { appWithTranslation } from 'i18n'
addDecorator(story => React.createElement(appWithTranslation(story)))

function loadStories() {
}

configure(loadStories, module)

import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    background: var(--dark-background);
    overflow-x: hidden;
  }

  :root{
    --dark-background: #000;
    --light-background: #fff;
    --button-background: linear-gradient( #88b 5%, #228 25%, #228 75%, #004 100% );
    --button-hover-background: radial-gradient( #88f 20%,  #44f 100%);
    --border: 1px solid #fff8;
    --action-background: #00f;
    --color: #fff;
    --test-border: 1px solid #fff8;
    --test-background: #fff4;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  main{
    overflow: hidden;
  }

`
export default GlobalStyles


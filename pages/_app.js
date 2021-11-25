import "../styles/globals.scss";
import { Provider } from "react-redux";
import wrapper from "../common/store";

import "fontsource-roboto";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

const theme = createMuiTheme({
  typography: {
    fontSize: 10,
  },
  overrides: {},
});

function MyApp({ Component, pageProps }) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MuiThemeProvider theme={theme}>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default wrapper.withRedux(MyApp);

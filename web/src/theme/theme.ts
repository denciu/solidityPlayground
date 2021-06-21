import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#dc4b78'
    },
    secondary: {
      main: '#3c4682'
    }
  },
  typography: {
    body2: {
      fontSize: '1em',
      fontWeight: 'bold'
    }
  }
})

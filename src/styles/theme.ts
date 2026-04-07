import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

export const standardTheme = createTheme({
  palette: {
    text: {
      primary: grey[700],
      secondary: grey[600]
    },
    primary: {
      main: '#339544'
    },
    info: {
      500: '#305496'
    },
    background: {
      default: '#f5f6ff',
      paper: '#ffffff'
    },
    success: {
      main: '#16db93'
    }
  },
  typography: {
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 14
    },
    button: {
      fontSize: 12
    }
  },
  components: {
    // MuiIconButton: {
    // 	defaultProps: {
    // 		sx: {
    // 			fontSize: 16
    // 		}
    // 	}
    // },
    MuiTable: {
      styleOverrides: {
        root: {
          'td, th': { fontSize: 12, padding: 0, textAlign: 'center' },
          td: { paddingTop: 4 },
          th: {
            color: 'white',
            backgroundColor: 'gray',
            svg: { display: 'none' }
          }
        }
      }
    },
    MuiTableCell: {
      defaultProps: {
        sx: {
          // fontSize: 12,
          // padding: 0,
          // paddingTop: 0.3,
          // textAlign: 'center'
        }
      }
      // styleOverrides: {
      //   root: {
      //     fontSize: 12,
      //     padding: '0px',
      //     paddingTop: 0.3,
      //     textAlign: 'center'
      //   },
      //   head: {
      //     fontSize: 12,
      //     padding: '0px',
      //     paddingTop: 0.3,
      //     textAlign: 'center'
      //   }
      // }
    },
    MuiAutocomplete: {
      defaultProps: {
        fullWidth: true,
        size: 'small'
      }
    },
    // MuiButton: {
    // 	defaultProps: {
    // 		disableElevation: true
    // 	}
    // },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    }
  }
})

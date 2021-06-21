import { makeStyles, Theme } from '@material-ui/core/styles'
import { TokenPanelProps } from './TokenPanel.types'
import { BaseTokensEnum } from '../../utils/utils'

export const useTokenPanelStyles = makeStyles<Theme, TokenPanelProps>(({ palette, spacing }) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: spacing(2)
  },
  withoutLabel: {
    marginTop: spacing(3)
  },
  textField: {
    width: 'calc(100% - 14px)'
  },
  button: {
    width: '50%'
  },
  fullWidthButton: {
    width: '100%'
  },
  center: {
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  header: props => ({
    backgroundColor: props.baseToken === BaseTokensEnum.TokenA ? palette.primary.main : palette.secondary.main
  }),
  adornment: props => ({
    backgroundColor: props.baseToken === BaseTokensEnum.TokenA ? palette.primary.main : palette.secondary.main,
    margin: `${spacing(2)}px 0px`,
    '& input': {
      backgroundColor: palette.background.default,
      paddingRight: '14px',
      textAlign: 'right'
    }
  })
}))

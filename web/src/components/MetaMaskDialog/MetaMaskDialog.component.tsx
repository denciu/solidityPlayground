import React from 'react'
import { useMetaMask } from 'metamask-react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useMetaMaskDialogStyles } from './MetaMaskDialog.styles'
import { useMetaMaskDialog } from './MetaMaskDialog.hooks'

export const MetaMaskDialog = () => {
  const classes = useMetaMaskDialogStyles()
  const { showDialog, connect, status, handleClose } = useMetaMaskDialog()

  const onClose = () => {
    if (status === 'connected') handleClose()
  }

  const renderContent = (status: ReturnType<typeof useMetaMask>['status']) => {
    switch (status) {
      case 'connected':
        if (showDialog) {
          handleClose()
        }
        return
      case 'notConnected':
        return (
          <Button onClick={connect} color="primary" variant='outlined'>
            Connect to MetaMask
          </Button>
        )
      case 'unavailable':
        return (
          <Typography>
            You need to install MetaMask to get going!
          </Typography>
        )
      default:
        return (
            <div className={classes.progress}>
              <LinearProgress color="secondary" />
            </div>
        )
    }
  }
  return (
    <Dialog
      open={showDialog}
      onClose={onClose}
    >
      <DialogContent className={classes.dialog}>
        {renderContent(status)}
      </DialogContent>
    </Dialog>
  )
}

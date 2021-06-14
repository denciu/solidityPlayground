import React, { useState } from 'react'
import { useMetaMask } from 'metamask-react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  progress: {
    width: '400px',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  dialog: {
    height: '200px'
  }
}))

export const MetaMaskDialog = () => {
  const { status, connect } = useMetaMask()
  const [showDialog, setShowDialog] = useState(true)
  const handleClose = () => setShowDialog(false)
  const classes = useStyles()

  const renderContent = (status: ReturnType<typeof useMetaMask>['status']) => {
    switch (status) {
      case 'connected':
        if (showDialog) {
          setShowDialog(false)
        }
        return
      case 'notConnected':
        return (
          <Button onClick={connect} color="primary">
            Connect to MetaMask
          </Button>
        )
      case 'unavailable':
        return (
          <DialogContent>
            You need to install MetaMask to get going!
        </DialogContent>
        )
      default:
        return (
          <DialogContent className={classes.dialog}>
            <div className={classes.progress}>
              <LinearProgress color="secondary" />
            </div>
          </DialogContent>
        )
    }
  }
  return (
    <Dialog
      open={showDialog}
      onClose={handleClose}
    >
      {renderContent(status)}
    </Dialog>
  )
}

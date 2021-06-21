import { useEffect, useState } from 'react'
import { useMetaMask } from 'metamask-react'

export const useMetaMaskDialog = () => {
  const { status, connect } = useMetaMask()
  const [showDialog, setShowDialog] = useState(status !== 'connected')
  const handleClose = () => setShowDialog(false)
  const handleOpen = () => setShowDialog(true)

  useEffect(() => {
    if (status !== 'connected') {
      handleOpen()
    }
  }, [status])

  return {
    status,
    connect,
    showDialog,
    handleOpen,
    handleClose
  }
}

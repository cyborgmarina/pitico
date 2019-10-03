import { useEffect, useState } from 'react'

export const useBadger = () => {
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof web4bch !== 'undefined') {
      //   const web4bch = new window.Web4Bch(new window.web4bch.providers.HttpProvider());
      const web4bch = new window.Web4Bch(window.web4bch.currentProvider)
      window.web4bch = web4bch

      if (web4bch.currentProvider.isConnected()) {
        console.info('web4bch connected')
        setError(false)
        return
      }

      const cashIdRequest =
        'cashid:cashid.badgerwallet.cash/api/parse.php?x=678525554'

      web4bch.bch.sign(web4bch.bch.defaultAccount, cashIdRequest, function (
        err
      ) {
        if (err) {
          console.log(err.message)
          setError({
            type: 'sign-in-error'
          })
        }

        setError(false)
        console.info('web4bch connected')
      })
    } else {
      setError({
        type: 'no-web4bch-detected'
      })
    }
  }, [])

  return {
    error
  }
}

const handleInputAutofill = (passwordInput: HTMLInputElement) => {
  // const title = document.createElement('p')
  // title.innerText = 'Enter password for this page'
  // const passwordInput = document.createElement('input')
  // passwordInput.type = 'password'
  // const addPasswordButton = document.createElement('button')
  // addPasswordButton.innerText = 'Add password'
  // const goAwayButton = document.createElement('button')
  // goAwayButton.innerText = 'fuck off'
  // goAwayButton.addEventListener('click', () => {
  //   popupDiv.remove()
  // })
  // popupDiv.appendChild(title)
  // popupDiv.appendChild(passwordInput)
  // popupDiv.appendChild(addPasswordButton)
  // popupDiv.appendChild(goAwayButton)
  // console.log('pm page append popup')
  // document.body.appendChild(popupDiv)
  //   addPasswordButton.addEventListener('click', () => {
  //     if (passwordInput.value.length < 8) {
  //       alert('Password must be at least 8 characters.')
  //       return
  //     }
  //     passwords.push({ password: passwordInput.value, url: location.href })
  //     popupDiv.remove()
  //     input.value = passwordInput.value
  //   })
}

chrome.webNavigation.onCompleted.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) return
  if (url.startsWith('chrome://')) return undefined

  // chrome.notifications.create({
  //   type: 'basic',
  //   iconUrl: '/assets/panda128.png',
  //   title: `Notification title`,
  //   message: 'Your message',
  //   priority: 1,
  // })

  chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    func: newPageLoad,
  })

  // chrome.scripting.executeScript({
  //   target: { tabId, frameIds: [frameId] },
  //   func: closePopupIfOpened,
  // })
})

const newPageLoad = () => {
  let inputs = document.getElementsByTagName('input')
  const inputLength = inputs.length
  for (let i = 0; i < inputLength; i++) {
    const passwordInput = inputs.item(i)
    if (passwordInput.type !== 'password') continue

    if (passwordInput.getBoundingClientRect().x == 0) continue

    const imageUrl = chrome.runtime.getURL('/assets/panda128.png')

    const triggerSize = 24
    passwordInput.style['background-image'] = `url("${imageUrl}")`

    passwordInput.style['background-repeat'] = 'no-repeat'
    passwordInput.style['background-position'] = 'right'
    passwordInput.style['background-attachment'] = 'scroll'
    passwordInput.style['background-size'] = triggerSize + 'px'
    passwordInput.style['box-shadow'] = 'none'
    passwordInput.style['cursor'] = 'pointer'
    passwordInput.classList.add('pm-password-input')
    passwordInput.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = passwordInput.getBoundingClientRect()
      const distanceFromRight = rect.right - event.clientX

      if (distanceFromRight <= triggerSize) {
        passwordInput.style.cursor = 'pointer'
      } else {
        passwordInput.style.cursor = 'auto'
      }
    })

    passwordInput.addEventListener('click', (event: MouseEvent) => {
      const rect = passwordInput.getBoundingClientRect()
      const distanceFromRight = rect.right - event.clientX

      if (distanceFromRight > triggerSize) {
        return
      }

      const popupWidth = 202

      const htmlURL = chrome.runtime.getURL('index.html')
      let popup = document.createElement('iframe')
      popup.classList.add('pm-pass-list-popup')
      popup.id = 'pm-iframe'
      popup.src = htmlURL
      popup.style['z-index'] = 1000000
      popup.style.width = popupWidth + 'px'
      popup.style.position = 'absolute'
      // minus 20 is for spacing between the image and the popup
      popup.style.left = rect.right - popupWidth - 20 + 'px'
      popup.style.border = 'none'
      popup.style.top = rect.top + rect.height / 2 + 'px'
      console.log('popup created')

      document.body.appendChild(popup)
    })
  }

  // closePopupIfOpened
  document.body.addEventListener('click', (event) => {
    console.log(event)
    const popup = document
      .getElementsByClassName('pm-pass-list-popup')
      .item(0) as HTMLIFrameElement

    console.log(popup)
    if (!popup) {
      return
    }

    const passwordInput = document
      .getElementsByClassName('pm-password-input')
      .item(0) as HTMLIFrameElement

    const rect = passwordInput.getBoundingClientRect()
    const distanceFromRight = rect.right - event.clientX

    // click on the trigger
    if (
      passwordInput.contains(event.target as any) &&
      distanceFromRight <= 24
    ) {
      return
    }

    // click inside the popup
    if (popup.contains(event.target as any)) {
      return
    }

    // Clicked outside popup and not on the open button\
    console.log('delete')
    document.body.removeChild(popup)
  })
}

const closePopupIfOpened = async () => {}

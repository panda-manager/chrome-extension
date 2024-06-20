import { environment } from './environments/environment'
import { getPathUrl } from './utils/path-utill'

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

  chrome.storage.local.get('token').then((data) => {
    if (!data['token']) {
      return
    }

    fetch(
      environment.baseUrl + '/credentials/existence?host=' + getPathUrl(url),
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + data['token'] },
      }
    )
      .then((r) => r.json())
      .then((res) => {
        if (!res.data) return

        chrome.scripting.executeScript({
          target: { tabId, frameIds: [frameId] },
          func: newPageLoad,
          args: [data['token'], getPathUrl(url)],
        })
      })
      .catch((error) => console.error(error.message))
  })
})

const newPageLoad = (jwtToken: string, url: string) => {
  let inputs = document.getElementsByTagName('input')
  const inputLength = inputs.length
  for (let i = 0; i < inputLength; i++) {
    const input = inputs.item(i)

    // Element is hidden
    if (window.getComputedStyle(input).display === 'none') continue

    if (input.type !== 'password') {
      input.classList.add('pm-username-input')
      continue
    }

    const passwordInput = input

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
      if (document.getElementsByClassName('pm-pass-list-popup').length !== 0) {
        return
      }

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

      document.body.appendChild(popup)
    })
  }

  // closePopupIfOpened
  document.body.addEventListener('click', (event) => {
    const popup = document
      .getElementsByClassName('pm-pass-list-popup')
      .item(0) as HTMLIFrameElement

    if (!popup) {
      return
    }

    const passwordInput = document
      .getElementsByClassName('pm-password-input')
      .item(0) as HTMLInputElement

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

    // Clicked outside popup and not on the open button
    document.body.removeChild(popup)
  })

  // get data from iframe
  window.addEventListener('message', (message) => {
    const popup = document
      .getElementsByClassName('pm-pass-list-popup')
      .item(0) as HTMLIFrameElement
    if (!popup) {
      return
    }

    if (message.source !== popup.contentWindow) {
      // Skip message in this event listener
      return
    }

    const passwordInput = document
      .getElementsByClassName('pm-password-input')
      .item(0) as HTMLInputElement

    const usernameInput = document
      .getElementsByClassName('pm-username-input')
      .item(0) as HTMLInputElement

    passwordInput.value = message.data.password
    usernameInput.value = message.data.login
    document.body.removeChild(popup)
  })
}

const closePopupIfOpened = async () => {}

import { environment } from './environments/environment'
import { getPathUrl } from './utils/path-utill'

let latestAutoSave = undefined

const createAutoSaveNotification = (data, hostUrl) => {
  const loginNotificationId = `pmAutoSaveNotification-${Date.now()}`
  chrome.notifications.create(loginNotificationId, {
    type: 'basic',
    iconUrl: '/assets/panda128.png',
    title: 'Panda Manager',
    message:
      'We noticed a new login attemp. Would you like to save the credentials',
    priority: 1,
    requireInteraction: true,
    buttons: [{ title: 'Save' }],
  })

  chrome.notifications.onButtonClicked.addListener((notificationId: string) => {
    if (notificationId !== loginNotificationId) {
      return
    }

    let queryOptions = { active: true, currentWindow: true }
    chrome.tabs.query(queryOptions).then((urls) => {
      chrome.storage.local.set({
        'pm-auto-save': {
          ...data,
          host: hostUrl,
          displayName: urls[0].title,
        },
      })
      chrome.windows.create(
        {
          url: chrome.runtime.getURL('index.html'),
          type: 'panel',
          width: 230,
          height: 180,
        },
        (newWindow) => {
          chrome.runtime.onMessage.addListener((request) => {
            if (request === 'close-auto-save-pm') {
              chrome.windows.remove(newWindow.id)
            }
          })
        }
      )
    })
  })
}
const injectAutoSave = (
  tabId: number,
  frameId: number,
  jwt: string,
  hostUrl: string
) => {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action !== 'login') return

    if (latestAutoSave === undefined) {
      latestAutoSave = Date.now()
    } else {
      const timeDifference = Math.abs(latestAutoSave - Date.now())
      if (timeDifference < 1000) {
        return
      }

      latestAutoSave = Date.now()
    }

    fetch(environment.baseUrl + 'credentials', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + jwt },
    })
      .then((r) => r.json())
      .then((res) => {
        const exsitingCred = res.find(
          (cred) =>
            cred['login'] === request.data.username && cred['host'] === hostUrl
        )
        if (exsitingCred) return

        createAutoSaveNotification(request.data, hostUrl)
      })
      .catch((error) => console.error(JSON.parse(error.error).message))
  })

  chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    func: suggestAutoSaveScript,
    args: [],
  })
}

chrome.webNavigation.onCompleted.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) return
  if (url.startsWith('chrome://')) return undefined

  chrome.storage.local.get('token').then((data) => {
    if (!data['token']) {
      return
    }

    injectAutoSave(tabId, frameId, data['token'], getPathUrl(url))

    fetch(
      environment.baseUrl + 'credentials/existence?host=' + getPathUrl(url),
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
          func: suggestAutoFillScript,
          args: [],
        })
      })
      .catch((error) => console.error(JSON.parse(error.error).message))
  })
})

const suggestAutoFillScript = () => {
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

    const clickEvent = new MouseEvent('click')

    // Dispatch a click event on the button
    document
      .getElementsByClassName('pm-login-button')
      .item(0)
      .dispatchEvent(clickEvent)
  })
}

const suggestAutoSaveScript = () => {
  const hasPasswordInput = () => {
    const inputs = document.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs.item(i)

      // Element is hidden
      if (window.getComputedStyle(input).display === 'none') continue

      if (input.type === 'password') {
        input.classList.add('pm-auto-save-password')
        return true
      }

      input.classList.add('pm-auto-save-username')
    }

    return false
  }

  const loginButton = document.querySelectorAll('button[type="submit"]').item(0)

  if (!hasPasswordInput() || !loginButton) {
    return
  }
  // auto save

  loginButton.classList.add('pm-login-button')

  function loginButtonClickFn(event: MouseEvent) {
    const pmInput = document.getElementsByClassName('pm-auto-save-password')
    if (pmInput.length !== 0 && (pmInput.item(0) as HTMLInputElement).value) {
      const passwordInput = document
        .getElementsByClassName('pm-auto-save-password')
        .item(0) as HTMLInputElement

      const usernameInput = document
        .getElementsByClassName('pm-auto-save-username')
        .item(0) as HTMLInputElement

      chrome.runtime.sendMessage({
        action: 'login',
        data: {
          username: usernameInput.value,
          password: passwordInput.value,
        },
      })

      // const button = document.getElementsByClassName('pm-login-button').item(0)

      // button.removeEventListener('click', loginButtonClickFn)
    }
  }

  loginButton.addEventListener('click', loginButtonClickFn)
}

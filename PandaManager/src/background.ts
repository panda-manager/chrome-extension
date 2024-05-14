chrome.webNavigation.onCompleted.addListener(({ tabId, frameId, url }) => {
  console.log('background work')
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
})

const newPageLoad = () => {
  console.log('pm page 1')

  let inputs = document.getElementsByTagName('input')
  const inputLength = inputs.length
  for (let i = 0; i < inputLength; i++) {
    const input = inputs.item(i)
    if (input.type !== 'password') continue

    // const { passwords } = await chrome.storage.sync.get('passwords')
    const passwords = []

    console.log('pm page start creating div')

    const inputRect = input.getBoundingClientRect()
    const triggerBtn = document.createElement('span')

    triggerBtn.id = 'pm-trigger'
    triggerBtn.innerText = '🐼'
    triggerBtn.style['z-index'] = 100
    triggerBtn.style.position = 'absolute'
    triggerBtn.style.left = inputRect.left + 'px'
    triggerBtn.style.top = inputRect.top + inputRect.height / 2 + 'px'

    triggerBtn.addEventListener('click', () => {
      const htmlURL = chrome.runtime.getURL('index.html')
      const popup = document.createElement('iframe')
      popup.id = 'pm-iframe'
      popup.src = htmlURL
      popup.style['z-index'] = 1000000
      popup.style.width = '250px'
      popup.style.position = 'absolute'
      popup.style.left = inputRect.left + 'px'
      popup.style.border = 'none'
      popup.style.top = 20 + inputRect.top + inputRect.height / 2 + 'px'
      document.body.appendChild(popup)
    })
    document.body.appendChild(triggerBtn)

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

  console.log('pm page end')
}

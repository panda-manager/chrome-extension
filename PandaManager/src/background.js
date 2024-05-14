chrome.webNavigation.onCompleted.addListener(({ tabId, frameId, url }) => {
  console.log('background word')
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
    target: { tabId },
    function: newPageLoad,
  })
})

const newPageLoad = async () => {
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

    // input.parentElement.insertBefore(triggerBtn, input)
    document.body.appendChild(triggerBtn)

    // popupDiv.style.backgroundColor = 'white'
    // const popupDiv = document.createElement('div')
    // popupDiv.style.position = 'absolute'
    // popupDiv.style.left = inputRect.left + 'px'
    // popupDiv.style.top = inputRect.top - (inputRect.height + 120) + 'px'
    // popupDiv.style.backgroundColor = 'white'
    // popupDiv.style.width = '250px'
    // popupDiv.style.height = '120px'
    // popupDiv.style.padding = '10px'
    // popupDiv.style.borderRadius = '5px'
    // popupDiv.style.border = 'solid 1px black'

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

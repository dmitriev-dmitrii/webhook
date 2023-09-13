const form = document.getElementById('connect-local-tunnel')
form.addEventListener('submit',formHandle)
function formHandle (event) {

    event.preventDefault()

    const {target} = event
    const url = target.querySelector('[name="url"]').value
    const phoneNumber = target.querySelector('[name="phone-number"]').value
    const toBeRemovedAt = target.querySelector('[name="to-be-removed-at"]').value
    fetch("/", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           url,
           phoneNumber,
           toBeRemovedAt,
        })
    })
}

const issueTemplate = document.querySelector('#issue-template')
if (issueTemplate) {
  await import('../socket.io/socket.io.js')

  const base = document.querySelector('base')
  const path = base ? (new URL('socket.io', base.href)).pathname : '/socket.io'
  const socket = window.io.connect('/', { path })

  socket.on('issues/create', (issue) => insertIssue(issue))
  socket.on('issues/update', (issue) => updateIssue(issue))
  socket.on('issues/close', (issue) => closeIssue(issue))
  socket.on('issues/reopen', (issue) => reopenIssue(issue))
}

/**
 * Inserts an issue into the issue container.
 *
 * @param {object} issue - The issue.
 */
function insertIssue (issue) {
  const issueContainer = document.querySelector('.issue-container')

  if (!issueContainer.querySelector(`[data-id="${issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    issueNode.querySelector('.card').setAttribute('data-id', issue.id)
    issueNode.querySelector('.card-title').textContent = issue.title
    issueNode.querySelector('h6').textContent = `${issue.name} (${issue.username})`
    issueNode.querySelector('img').setAttribute('src', issue.avatar)
    issueNode.querySelector('.card-text').textContent = issue.description
    issueNode.querySelector('form').setAttribute('action', `./issues/${issue.iid}/close`)

    issueContainer.append(issueNode)
  }
}

/**
 * Updates an issue's description.
 *
 * @param {object} issue - The issue.
 */
function updateIssue (issue) {
  const issueCard = document.querySelector(`[data-id="${issue.id}"]`)
  issueCard.querySelector('.card-text').textContent = issue.newDescription
}

/**
 * Closes an issue.
 *
 * @param {object} issue - The issue.
 */
function closeIssue (issue) {
  const issueCard = document.querySelector(`[data-id="${issue.id}"]`)
  issueCard.querySelector('.card-title').textContent = issue.title + ' (Closed)'

  const button = issueCard.querySelector('button')
  button.classList.remove('btn', 'btn-primary')
  button.classList.add('btn', 'btn-danger')
  button.textContent = 'Reopen issue'
}

/**
 * Reopens an issue.
 *
 * @param {object} issue - The issue.
 */
function reopenIssue (issue) {
  const issueCard = document.querySelector(`[data-id="${issue.id}"]`)
  issueCard.querySelector('.card-title').textContent = issue.title

  const button = issueCard.querySelector('button')
  button.classList.remove('btn', 'btn-danger')
  button.classList.add('btn', 'btn-primary')
  button.textContent = 'Close issue'
}

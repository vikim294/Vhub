const port = 2941
const baseURL = `http://localhost:${port}`

const pathProcess = (path) => {
  return baseURL + path.substring(6)
}

module.exports = { port, baseURL, pathProcess }

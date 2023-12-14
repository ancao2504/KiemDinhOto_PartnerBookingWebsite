const fs = require('fs')
const axios = require('axios').default
const loginToZaloFunction = require('./node_modules/zmp-cli/login')
const deployToZaloFunction = require('./node_modules/zmp-cli/deploy')
const zmpCliConstant = require('./node_modules/zmp-cli/utils/constants')
const spinner = require('./node_modules/zmp-cli/utils/spinner')
const log = require('./node_modules/zmp-cli/utils/log')

function configFile() {
  const temp = {
    app: {
      title: 'TTDK',
      headerColor: '#1843EF',
      textColor: 'white',
      statusBarColor: '#1843EF',
      leftButton: 'back'
    },
    debug: false,
    listCSS: [],
    listSyncJS: [],
    listAsyncJS: [],
    pages: ['index.html']
  }

  let listCSSFile = fs.readdirSync(__dirname + '/build/static/css')
  listCSSFile = listCSSFile.filter((file) => file.endsWith('.css'))
  listCSSFile = listCSSFile.map((file) => `static/css/${file}`)

  let listJSFile = fs.readdirSync(__dirname + '/build/static/js')
  listJSFile = listJSFile.filter((file) => file.endsWith('.js'))
  listJSFile = listJSFile.map((file) => `static/js/${file}`)

  temp.listSyncJS = listJSFile
  temp.listCSS = listCSSFile
  fs.writeFileSync('app-config.json', JSON.stringify(temp), { encoding: 'utf-8' })
}

const logger = {
  statusStart: (text) => spinner.start(text),
  statusDone: (text) => spinner.done(text),
  statusText: (text) => spinner.text(text),
  statusError: (text) => spinner.error(text),
  text: (text) => log.text(text),
  error: (text) => log.error(text),
  showOnUI: () => {}
}

async function deployToZalo() {
  let envConfig = {}
  fs.readFileSync(__dirname + '/.env', { encoding: 'utf-8' })
    .split('\n')
    .forEach((_item) => {
      if (_item.trim().replace(/\r/g, '')) {
        _item = _item.replace(/\r/g, '')
        const keyValue = _item.split('=')
        envConfig[keyValue[0]] = keyValue[1].replace(/\r/g, '')
      }
    })

  if (envConfig['NODE_ENV'].includes('dev')) {
    return
  }

  configFile()
  const REACT_APP_API_URL = envConfig['REACT_APP_API_URL']

  const accessToken = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}/getZaloAccessToken`,
    headers: {
      authorization: envConfig['GET_ZALO_USER_ACCESS_TOKEN_API_KEY']
    }
  })
    .then((res) => {
      if (res.status === 200) {
        return res.data
      }
    })
    .catch((err) => {
      console.log(err)
      return undefined
    })

  if (!accessToken) {
    console.error('get zalo user accessToken from', REACT_APP_API_URL, 'failed')
    return
  }

  const loginConfigOption = {
    cwd: process.cwd(),
    loginMethod: 'accessToken',
    token: accessToken
  }
  await loginToZaloFunction(loginConfigOption, logger)

  const deployConfigOptions = {
    cwd: process.cwd(),
    dev: undefined,
    mode: undefined,
    quit: false,
    outputDir: 'build',
    versionStatus: zmpCliConstant.versionStatus.TESTING,
    desc: 'script automatically deploys app',
    customProject: true
  }
  await deployToZaloFunction(deployConfigOptions, logger)
  return
}

deployToZalo()

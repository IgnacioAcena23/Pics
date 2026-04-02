import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'hzboyqs4',
    dataset: 'production'
  },
  deployment: {
    appId: 's55c068d7xolp8rl8yd401av',
    autoUpdates: true,
  }
})

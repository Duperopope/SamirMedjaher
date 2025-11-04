module.exports = {
  apps: [
    {
      name: 'cv-gaming-v048',
      script: 'python3',
      args: '-m http.server 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s'
    }
  ]
};

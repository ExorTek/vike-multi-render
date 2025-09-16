module.exports = {
  apps: [
    {
      name: 'vike-server-3000',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '512M',
      node_args: '--max-old-space-size=1024',
      log_file: `logs/vike-3000-combined.log`,
      out_file: `logs/vike-3000-out.log`,
      error_file: `logs/vike-3000-error.log`,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      kill_timeout: 3000,
      listen_timeout: 5000,
    },

    // if you want to run multiple instances of the server, you can do so like this:
    // {
    //   name: 'vike-server-3001',
    //   script: 'server.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 3001,
    //   },
    //   max_memory_restart: '512M',
    //   node_args: '--max-old-space-size=1024',
    // }
  ],
};

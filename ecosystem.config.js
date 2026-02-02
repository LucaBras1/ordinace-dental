/**
 * PM2 Ecosystem Configuration
 *
 * Start: pm2 start ecosystem.config.js
 * Restart: pm2 restart dentalka
 * Logs: pm2 logs dentalka
 * Status: pm2 status
 */
module.exports = {
  apps: [
    {
      name: 'dentalka',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005',
      cwd: '/www/hosting/muzx.cz/dentalka',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/www/hosting/muzx.cz/dentalka/logs/error.log',
      out_file: '/www/hosting/muzx.cz/dentalka/logs/out.log',
      merge_logs: true,
      // Graceful restart
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
}

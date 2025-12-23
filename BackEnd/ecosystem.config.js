module.exports = {
  apps: [
    {
      name: "soulliqo-backend",
      script: "./Server.js",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      env: {
        NODE_ENV: "development",
        PORT: 5000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M"
    }
  ]
};

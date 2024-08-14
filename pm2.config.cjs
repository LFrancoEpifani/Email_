module.exports = {
    apps: [{
        name: 'mail-dashboard',
        script: 'build/index.js',
        node_args: '-r dotenv/config',
    }],
}
const path = require('path');

module.exports = {
    entry: {
        'react-simple-login': './resources/js/react/simple-login.jsx',
        'react-dashboard': './resources/js/react/dashboard.jsx',
        'react-students': './resources/js/react/students.jsx',
        'react-faculty': './resources/js/react/faculty.jsx',
        'react-settings': './resources/js/react/settings.jsx',
        'react-account': './resources/js/react/account.jsx',
        'react-reports': './resources/js/react/reports.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js',
        libraryTarget: 'window'
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode: 'development'
};

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    mode: 'development',
    devtool: 'inline-source-map',
    target: ['web', 'es5'],
    entry: './tests/index.browser.js',
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'dist/tests'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    optimization: {
        minimize: false,
    },
};

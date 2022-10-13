import webpack from 'webpack';

export default {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^jezvejs/,
            function (resource) {
                const ctx = resource.context;
                const path = ctx.substring(ctx.lastIndexOf('demo')).split('\\').fill('..').join('/');
                const relPart = `${path}/packages/jezvejs/`;

                if (resource.request === 'jezvejs/style') {
                    resource.request = `${relPart}src/css/common.scss`;
                } else if (resource.request.startsWith('jezvejs/style/')) {
                    const component = resource.request.substring('jezvejs/style/'.length);
                    resource.request = `${relPart}src/Components/${component}/style.scss`;
                } else {
                    resource.request = `${relPart}index.js`;
                }
            }
        ),
    ],
};

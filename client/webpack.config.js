const path = require("path");
module.exports = {

    entry:"./www/app/main.js",
    output:{

        filename:"bundle.js",
        publicPath:"xuni"
    },
    watch:true,
    mode:"development",
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:"babel-loader",
                exclude:[
                    path.resolve(__dirname,"node_modules")
                ],
                include:[
                    path.resolve(__dirname,"www/app")
                ],
                options:{
                    presets:["env","react"],
                    plugins:["transform-object-rest-spread","transform-runtime"]
                }
            },
            {
                test: /\.less$/,
                exclude:[
                    path.resolve(__dirname,"node_modules")
                ],
                include:[
                    path.resolve(__dirname,"www/app")
                ],
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader", options: {
                        strictMath: true,
                        noIeCompat: true
                    }
                }]
            }
        ]
    },
    devServer:{
        proxy:{
            "/api":{
                target: 'http://127.0.0.1:3000',
                host: 'http://192.168.0.240',
                port: 8080,
                changeOrigin: true,
                pathRewrite:{
                    "^/api":"/"
                }
            }
        }
    }
}
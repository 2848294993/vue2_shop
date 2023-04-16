const prodPlugins = [];
//判断是否处在上线模式下
if (process.env.NODE_ENV === "production") {//如果处在上线模式下
  prodPlugins.push("transform-remove-console");
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
  ]
}

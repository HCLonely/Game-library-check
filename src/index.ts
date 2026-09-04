const { bootstrapMergedRuntime } = require('./runtime/bootstrap.ts') as {
  /** 初始化合并后的用户脚本运行时。 */
  bootstrapMergedRuntime: () => void;
};

/** 当打包后的入口点执行时启动合并后的用户脚本运行时。 */
(function main() {
  bootstrapMergedRuntime();
})();

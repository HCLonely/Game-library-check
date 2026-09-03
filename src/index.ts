const { bootstrapMergedRuntime } = require('./runtime/bootstrap.ts') as {
  bootstrapMergedRuntime: () => void;
};

(function main() {
  bootstrapMergedRuntime();
})();

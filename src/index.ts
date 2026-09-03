const { bootstrapMergedRuntime } = require('./runtime/bootstrap') as {
  bootstrapMergedRuntime: () => void;
};

(function main() {
  bootstrapMergedRuntime();
})();

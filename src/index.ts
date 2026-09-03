const { bootstrapMergedRuntime } = require('./runtime/bootstrap.ts') as {
  bootstrapMergedRuntime: () => void;
};

/** Starts the merged userscript runtime when the bundled entrypoint executes. */
(function main() {
  bootstrapMergedRuntime();
})();

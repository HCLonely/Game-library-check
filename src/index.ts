const { bootstrapMergedRuntime } = require('./runtime/bootstrap.ts') as {
  /** Initializes the merged userscript runtime. */
  bootstrapMergedRuntime: () => void;
};

/** Starts the merged userscript runtime when the bundled entrypoint executes. */
(function main() {
  bootstrapMergedRuntime();
})();

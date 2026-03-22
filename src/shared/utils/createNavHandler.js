/**
 * Factory that creates an independent navigation handler pair.
 * Each call returns a fresh { register, open } pair with its own closure,
 * replacing the module-level singletons that would conflict if both
 * demo and real routers existed in the same bundle.
 *
 * Usage:
 *   const customerNav = createNavHandler();
 *   // In router: customerNav.register((id, from) => { ... });
 *   // In component: customerNav.open(customerId, fromView);
 */
export function createNavHandler() {
  let _handler = null;
  return {
    register: (fn) => { _handler = fn; },
    open: (...args) => { if (_handler) _handler(...args); },
  };
}

// Request cancellation on route changes
class RequestManager {
  private static controllers = new Set<AbortController>();
  
  static createController(): AbortController {
    const controller = new AbortController();
    this.controllers.add(controller);
    return controller;
  }
  
  static removeController(controller: AbortController): void {
    this.controllers.delete(controller);
  }
  
  static cancelAll(): void {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }
}

// Cancel requests on route change
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    RequestManager.cancelAll();
  });
}

export { RequestManager };
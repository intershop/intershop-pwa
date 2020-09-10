export class ConfirmDialog {
  static confirm(message: string): boolean {
    return window.confirm(message);
  }
}

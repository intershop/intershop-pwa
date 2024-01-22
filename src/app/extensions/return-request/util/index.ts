export function allowedStatus(status: string) {
  return ['STATE_COMMISSIONED_PARTLY_DISPATCHED', 'EXPORTED'].includes(status);
}

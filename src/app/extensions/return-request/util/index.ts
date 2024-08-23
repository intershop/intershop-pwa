export function allowedStatus(status: string) {
  return [
    'STATE_COMMISSIONED_PARTLY_DISPATCHED',
    'STATE_DISPATCHED',
    'STATE_DISPATCHED_PARTLY_RETURNED',
    'EXPORTED',
    'STATE_COMMISSIONED_PARTLY_DISPATCHED_PARTLY_RETURNED',
  ].includes(status);
}

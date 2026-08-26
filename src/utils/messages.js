export const PASS_MESSAGE = 'Nah Ntapss, jago bgt dah pokoknya!'
export const FAIL_MESSAGE = 'Belum lulus, dah doa blm tadi? but isokey masih try out kok'

export function scoreLabel(passed) {
  return passed ? PASS_MESSAGE : FAIL_MESSAGE
}

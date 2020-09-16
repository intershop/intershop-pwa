import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';

export default (durationMillis = 1000): AnimationTriggerMetadata =>
  trigger('bottomOut', [
    state('*', style({ transform: 'translateY(0)' })),
    state('bottom-out', style({ transform: 'translateY(100%)' })),
    transition('* => bottom-out', animate(`${durationMillis}ms ease-out`)),
  ]);

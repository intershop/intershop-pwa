import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';

export default (durationMillSeconds = 1000): AnimationTriggerMetadata =>
  trigger('bottomOut', [
    state('*', style({ transform: 'translateY(0)' })),
    state('bottom-out', style({ transform: 'translateY(100%)' })),
    transition('* => bottom-out', animate(`${durationMillSeconds}ms ease-out`)),
  ]);

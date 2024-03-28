/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, InjectionToken, Injector, inject } from '@angular/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { InjectMultiple } from 'ish-core/utils/injection';

export interface FeatureEventResultListener {
  feature: string;
  event: string;
  resultListener$(id: string): Observable<FeatureEventResult>;
}

export interface FeatureEventResult {
  id: string;
  event: string;
  successful: boolean;
  data?: any;
}

export interface FeatureEventNotifier {
  id: string;
  feature: string;
  event: string;
  data?: any;
}

export const FEATURE_EVENT_RESULT_LISTENER = new InjectionToken<FeatureEventResultListener>(
  'featureEventResultListener'
);

@Injectable({ providedIn: 'root' })
export class FeatureEventService {
  private internalEventNotifier$ = new Subject<FeatureEventNotifier>();
  private internalEventResult$ = new Subject<FeatureEventResult>();

  private eventListeners: FeatureEventResultListener[] = [];

  private featureToggleService = inject(FeatureToggleService);

  /**
   * Event stream to notify extensions for further actions
   */
  eventNotifier$ = this.internalEventNotifier$.asObservable();

  /**
   * Event stream to notify for event results
   */
  eventResults$ = this.internalEventResult$.asObservable();

  /**
   * Will send new notification to event stream. Subscriber (extensions) to this event stream could react accordingly.
   * @param feature responsible extension
   * @param event event type
   * @param data optional data for event
   * @returns identifier of generated event
   */
  sendNotification(feature: string, event: string, data?: any): string {
    const id = uuid();
    this.internalEventNotifier$.next({ id, feature, event, data });
    return id;
  }

  /**
   * Will send results of event back. Subscriber (event trigger) to this result stream could react accordingly.
   * @param id identifier of generated even
   * @param event event type
   * @param successful Is result successful?
   * @param data optional data for event
   */
  sendResult(id: string, event: string, successful: boolean, data?: any) {
    this.internalEventResult$.next({ id, event, successful, data });
  }

  /**
   * Will append all configured FEATURE_EVENT_RESULT_LISTENER together to be available in the FeatureEventNotifierService
   * @param injector current injector instance
   */
  setupAvailableResultListener(injector: Injector) {
    // get all configured result listener by FEATURE_EVENT_RESULT_LISTENER injection token from current injector instance
    const eventListeners = injector.get<InjectMultiple<typeof FEATURE_EVENT_RESULT_LISTENER>>(
      FEATURE_EVENT_RESULT_LISTENER,
      []
    );

    // append configured listener to available eventListeners list in case it is not yet available
    eventListeners.forEach(eventListener => {
      if (this.eventListeners.find(el => el.feature === eventListener.feature && el.event === eventListener.event)) {
        return;
      }

      this.eventListeners.push(eventListener);
    });
  }

  /**
   * Find correct event result listener
   * @param feature responsible extension
   * @param event event type
   * @param id id of generated notification event
   * @returns result listener stream, which should notify about results of notification event
   */
  eventResultListener$(feature: FeatureToggleType, event: string, id: string): Observable<FeatureEventResult> {
    return this.featureToggleService
      .enabled$(feature)
      .pipe(
        switchMap(() =>
          this.eventListeners.find(el => el.feature === feature && el.event === event)?.resultListener$(id)
        )
      );
  }
}

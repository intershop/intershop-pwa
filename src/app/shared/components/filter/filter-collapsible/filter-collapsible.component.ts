import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Filter } from 'ish-core/models/filter/filter.model';

@Component({
  selector: 'ish-filter-collapsible',
  templateUrl: './filter-collapsible.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCollapsibleComponent implements OnInit {
  @Input({ required: true }) filterElement: Filter;
  @Input() collapsed: boolean;

  @Output() collapsedChange = new EventEmitter<boolean>();

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.collapsed;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }
}

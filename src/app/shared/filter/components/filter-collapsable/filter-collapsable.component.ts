import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ish-filter-collapsable',
  templateUrl: './filter-collapsable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCollapsableComponent implements OnInit {
  @Input() title: string;
  @Input() collapsed: boolean;
  @Output() collapsedChanged = new EventEmitter<boolean>();

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.collapsed;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChanged.emit(this.isCollapsed);
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';

/**
 * The CMS Video Component displays a video in a HTML5 <iframe> or an internal video in HTML5 <video> container.
 */
@Component({
  selector: 'ish-cms-video',
  templateUrl: './cms-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSVideoComponent implements OnInit {
  @Input() pagelet: ContentPageletView;

  @ViewChild('videoPlayer') videoplayer: ElementRef;

  videoUrl: SafeUrl;
  containerClasses = '';
  height = '';
  width = '';
  headingText: string;
  imageLink: SafeUrl;
  isInternal: boolean;
  isAutoplay: boolean;
  isMute: boolean;
  isPlay: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getVideoSettings();
    this.createUrl();
  }

  private getVideoSettings() {
    this.containerClasses = this.pagelet.stringParam('CSSClass');
    this.headingText = this.pagelet.stringParam('Heading');
    this.isAutoplay = this.pagelet.booleanParam('Autoplay');
    this.isMute = this.pagelet.booleanParam('Mute');
    this.isInternal = this.pagelet.booleanParam('Internal');

    this.imageLink = this.pagelet.stringParam('Image');

    const videoSize = this.pagelet.stringParam('VideoSizePreset');
    if (videoSize) {
      if (videoSize === 'custom') {
        this.width = this.pagelet.stringParam('VideoWidth');
        this.height = this.pagelet.stringParam('VideoHeight');
      } else {
        this.width = videoSize.slice(0, videoSize.indexOf('x'));
        this.height = videoSize.slice(videoSize.indexOf('x') + 1, videoSize.length);
      }
    }
  }

  private createUrl() {
    const urlLowerCase = this.pagelet.stringParam('Video').toLowerCase();

    if (urlLowerCase.indexOf('youtube') > -1) {
      this.createVideoUrlYoutube();
    } else {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pagelet.stringParam('Video'));
    }
  }

  private createVideoUrlYoutube() {
    let url = this.pagelet.stringParam('Video').replace('watch?v=', 'embed/') + '?';

    if (this.isAutoplay) {
      url = url.concat('autoplay=1&');
    }
    if (this.isMute) {
      url = url.concat('mute=1&');
    }
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  playVideo() {
    this.videoplayer.nativeElement.play();
  }
}
